require 'fileutils'

class DocumentsController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false
  skip_before_action :require_login, only: [:upload, :create], raise: false

  def index
    page = (params[:page] || 1).to_i
    per_page = 10

    query = DocumentItem.includes(:category, :document_versions, document_comments: :user).joins(:category)

    query = query.where(institution_id: params[:institution_id]) if params[:institution_id].present?
    query = query.where(cycle: params[:cycle]) if params[:cycle].present?

    if params[:search].present?
      termo = "%#{params[:search]}%"
      query = query.where("document_items.name ILIKE :q OR categories.name ILIKE :q", q: termo)
    end

    total_items = query.distinct.count(:id)
    total_pages = (total_items.to_f / per_page).ceil
    offset = (page - 1) * per_page

    documents = query.order('categories.name ASC, document_items.due_date ASC').limit(per_page).offset(offset)

    payload = {
      data: documents.map do |doc|
        {
          id: doc.id,
          category_name: doc.category&.name,
          name: doc.name,
          orientation: doc.orientation,
          mandatory: doc.mandatory,
          due_date: doc.due_date.to_s,
          status: doc.status,
          institution_id: doc.institution_id,
          cycle: doc.respond_to?(:cycle) ? doc.cycle : nil,
          
          comments: doc.document_comments.sort_by { |c| c.created_at || Time.at(0) }.reverse.map do |c|
            {
              id: c.id,
              author: c.user&.name || 'Sistema',
              body: c.body,
              date: c.created_at&.strftime('%d/%m %H:%M')
            }
          end,
          
          versions: doc.document_versions.sort_by { |v| -(v.version_number || 0) }.map do |v|
            { 
              version_number: v.version_number, 
              status: v.status, 
              uploaded_by: v.uploaded_by&.name || "Sistema",
              reviewed_by: v.reviewed_by&.name,
              drive_url: v.respond_to?(:drive_url) ? v.drive_url : nil
            }
          end
        }
      end,
      meta: { current_page: page, total_pages: total_pages == 0 ? 1 : total_pages, total_items: total_items }
    }

    render json: payload, status: :ok
  end

  def create
    raw_body = request.raw_post.to_s
    body = raw_body.empty? ? {} : JSON.parse(raw_body) rescue {}

    category_name = body["category"] || "Geral"
    category = Category.where("name ILIKE ?", "%#{category_name}%").first
    category ||= Category.create!(name: category_name, position: 1)

    doc = DocumentItem.new(
      name: body["name"] || "Nova Evidência",
      category: category,
      institution_id: body["institution_id"] || request.query_parameters[:institution_id] || Institution.first&.id,
      cycle: body["cycle"] || request.query_parameters[:cycle] || "2026",
      status: body["status"] || "pendente",
      mandatory: true
    )

    if doc.save
      doc.document_versions.create!(
        version_number: 1,
        status: doc.status,
        uploaded_by: current_user || User.first
      )

      if body["notes"].present?
        doc.document_comments.create!(
          body: body["notes"],
          user: current_user || User.first
        )
      end

      render json: { message: "Evidência criada com sucesso!", document: doc }, status: :created
    else
      render json: { error: doc.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end

  def upload
    file = params[:file]
    category_slug = params[:category]
    user_name = params[:user_name]
    institution_id = params[:institution_id]
    cycle = params[:cycle].presence || '2026'

    return render json: { error: 'Ficheiro não enviado.' }, status: :bad_request unless file.present?

    actor = current_user || User.find_by(name: user_name) || User.first
    institution = institution_id.present? ? Institution.find_by(id: institution_id) : Institution.first

    category = Category.where("name ILIKE ?", "%#{category_slug}%").first
    category ||= Category.first
    category ||= Category.create!(name: "Geral", position: 1)

    begin
      document_item = DocumentItem.find_or_create_by(
        category: category, 
        name: file.original_filename,
        institution_id: institution&.id,
        cycle: cycle
      ) do |doc|
        doc.status = 'em_revisao'
        doc.mandatory = true
        doc.due_date = Date.current + 30.days
      end

      current_version_number = document_item.document_versions.maximum(:version_number) || 0
      next_version = current_version_number + 1

      drive_data = nil
      begin
        drive_data = GoogleDriveService.new.upload_file(file)
      rescue => e
        Rails.logger.error "[GoogleDrive] Falha ou Cota Excedida: #{e.message}"
      end

      local_url = nil
      unless drive_data
        upload_dir = Rails.root.join('public', 'uploads')
        FileUtils.mkdir_p(upload_dir) unless File.directory?(upload_dir)
        
        safe_filename = "#{Time.now.to_i}_#{file.original_filename.gsub(/[^0-9A-Za-z.\-]/, '_')}"
        file_path = upload_dir.join(safe_filename)
        
        File.open(file_path, 'wb') do |f|
          f.write(file.read)
        end
        
        local_url = "http://localhost:3000/uploads/#{safe_filename}"
      end

      version_params = {
        version_number: next_version,
        status: 'em_revisao',
        uploaded_by: actor
      }

      if drive_data.is_a?(Hash)
        version_params[:drive_id] = drive_data[:drive_id] if DocumentVersion.column_names.include?('drive_id')
        version_params[:drive_url] = drive_data[:web_link] if DocumentVersion.column_names.include?('drive_url')
      elsif local_url
        version_params[:drive_url] = local_url if DocumentVersion.column_names.include?('drive_url')
      end

      document_item.document_versions.create!(version_params)
      document_item.update!(status: 'em_revisao')

      render json: { 
        success: true, 
        message: "Upload da versão #{next_version} registado.",
        drive_synced: drive_data.present?
      }, status: :created
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: "Erro de Base de Dados: #{e.record.errors.full_messages.join(', ')}" }, status: :unprocessable_entity
    rescue => e
      render json: { error: "Falha interna ao gravar: #{e.message}" }, status: :unprocessable_entity
    end
  end

  def review
    document_item = DocumentItem.find_by(id: params[:id])
    return render json: { error: 'Documento não encontrado.' }, status: :not_found unless document_item

    new_status = params[:status]
    notes = params[:notes]
    new_due_date = params[:due_date]
    user_name = params[:user_name]
    
    reviewer = current_user || User.find_by(name: user_name) || User.first

    if new_status == 'correcao_solicitada' && notes.blank?
      return render json: { error: 'É obrigatório informar o motivo da recusa.' }, status: :unprocessable_entity
    end

    begin
      update_params = { status: new_status }
      update_params[:due_date] = new_due_date if new_due_date.present?
      document_item.update!(update_params)

      if notes.present?
        document_item.document_comments.create!(
          body: notes,
          user: reviewer
        )
      end

      latest_version = document_item.document_versions.order(version_number: :desc).first
      reason_to_save = notes.present? ? notes : "Sem observações."

      if latest_version
        latest_version.update!(
          status: new_status,
          correction_reason: reason_to_save,
          reviewed_by: reviewer,
          reviewed_at: Time.current
        )
      else
        latest_version = document_item.document_versions.create!(
          version_number: 1,
          status: new_status,
          correction_reason: reason_to_save,
          reviewed_by: reviewer,
          reviewed_at: Time.current,
          uploaded_by: reviewer 
        )
      end

      begin
        AuditLog.create(
          document_version: latest_version,
          user: reviewer,
          action: new_status == 'aprovado' ? 'approval' : 'review',
          from_status: 'em_revisao',
          to_status: new_status,
          comment: notes.present? ? notes : "Documento validado com sucesso."
        )
      rescue => audit_error
        Rails.logger.warn "Falha ao gravar AuditLog: #{audit_error.message}"
      end

      if new_status == 'correcao_solicitada'
        begin
          DocumentMailer.correction_requested(document_item, reviewer&.name || 'Advogado', notes).deliver_now
        rescue => mail_error
          Rails.logger.error "========= ERRO AO ENVIAR EMAIL: #{mail_error.message} ========="
        end
      end

      render json: { success: true, message: "Gravado com sucesso." }, status: :ok
    
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: "Erro na base de dados: #{e.record.errors.full_messages.join(', ')}" }, status: :unprocessable_entity
    rescue => e
      render json: { error: "Falha na execução: #{e.message}" }, status: :unprocessable_entity
    end
  end

  def export
    require 'csv'
    documents = DocumentItem.includes(:category, :document_versions).order('categories.name ASC')

    documents = documents.where(institution_id: params[:institution_id]) if params[:institution_id].present?
    documents = documents.where(cycle: params[:cycle]) if params[:cycle].present?

    csv_data = CSV.generate(headers: true, col_sep: ',') do |csv|
      csv << ['Documento', 'Categoria', 'Versao', 'Validade', 'Status', 'Ciclo']
      
      documents.each do |doc|
        version = doc.document_versions.size > 0 ? doc.document_versions.size : 1
        due_date = doc.due_date ? doc.due_date.strftime('%d/%m/%Y') : 'Sem vencimento'
        cycle_val = doc.respond_to?(:cycle) ? doc.cycle : 'N/A'
        
        csv << [doc.name, doc.category&.name || 'Geral', "v.#{version}", due_date, doc.status&.upcase || 'PENDENTE', cycle_val]
      end
    end

    send_data csv_data, filename: "checklist_cebas_#{Time.now.year}.csv", type: "text/csv"
  end

  def classify
    render json: { message: "Não implementado." }, status: :ok
  end
end