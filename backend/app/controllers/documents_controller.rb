class DocumentsController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false
  skip_before_action :require_login, only: [:upload], raise: false

  def index
    page = (params[:page] || 1).to_i
    per_page = 10

    query = DocumentItem.includes(:category, :document_versions).joins(:category)

    if params[:search].present?
      termo = "%#{params[:search]}%"
      query = query.where("document_items.name ILIKE :q OR categories.name ILIKE :q", q: termo)
    end

    total_items = query.count
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
          versions: doc.document_versions.sort_by { |v| -v.version_number }.map do |v|
            { 
              version_number: v.version_number, 
              status: v.status, 
              reason: v.correction_reason,
              uploaded_by: v.uploaded_by&.name || "Sistema",
              reviewed_by: v.reviewed_by&.name,
              drive_url: v.respond_to?(:drive_url) ? v.drive_url : nil
            }
          end
        }
      end,
      meta: { 
        current_page: page, 
        total_pages: total_pages == 0 ? 1 : total_pages, 
        total_items: total_items 
      }
    }

    render json: payload, status: :ok
  end

  def upload
    file = params[:file]
    category_slug = params[:category]
    user_name = params[:user_name]

    return render json: { error: 'Ficheiro não enviado.' }, status: :bad_request unless file.present?

    actor = current_user || User.find_by(name: user_name) || User.first
    institution = Institution.first rescue nil

    category = Category.where("name ILIKE ?", "%#{category_slug}%").first
    category ||= Category.first
    category ||= Category.create!(name: "Geral", position: 1)

    begin
      # === CORREÇÃO: Passamos a instituição para não falhar a validação (belongs_to) ===
      document_item = DocumentItem.find_or_create_by(category: category, name: file.original_filename) do |doc|
        doc.status = 'em_revisao'
        doc.mandatory = true
        doc.due_date = Date.current + 30.days
        doc.institution = institution if institution 
      end

      current_version_number = document_item.document_versions.maximum(:version_number) || 0
      next_version = current_version_number + 1

      drive_data = nil
      begin
        drive_data = GoogleDriveService.new.upload_file(file)
      rescue => e
        Rails.logger.error "[GoogleDrive] Falha no upload: #{e.message}"
      end

      version_params = {
        version_number: next_version,
        status: 'em_revisao',
        uploaded_by: actor
      }

      if drive_data.is_a?(Hash)
        version_params[:drive_id] = drive_data[:drive_id] if DocumentVersion.column_names.include?('drive_id')
        version_params[:drive_url] = drive_data[:web_link] if DocumentVersion.column_names.include?('drive_url')
      end

      document_item.document_versions.create!(version_params)
      document_item.update!(status: 'em_revisao')

      render json: { 
        success: true, 
        message: "Upload da versão #{next_version} registado.",
        drive_synced: drive_data.present?
      }, status: :created
    rescue ActiveRecord::RecordInvalid => e
      # Se a base de dados recusar, devolve o erro EXATO para o seu Toast no Front-end!
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

      latest_version = document_item.document_versions.order(version_number: :desc).first
      
      new_thread_note = notes.presence
      if new_thread_note
        timestamp = Time.current.strftime('%d/%m %H:%M')
        author = reviewer&.name || 'Sistema'
        formatted_note = "[#{timestamp} - #{author}] #{new_thread_note}"
      end
      
      if latest_version
        combined_notes = latest_version.correction_reason
        combined_notes = [combined_notes, formatted_note].compact.join("\n\n") if formatted_note

        latest_version.update!(
          status: new_status,
          correction_reason: combined_notes,
          reviewed_by: reviewer,
          reviewed_at: Time.current
        )
      else
        latest_version = document_item.document_versions.create!(
          version_number: 1,
          status: new_status,
          correction_reason: formatted_note,
          reviewed_by: reviewer,
          reviewed_at: Time.current,
          uploaded_by: reviewer 
        )
      end

      AuditLog.create!(
        document_version: latest_version,
        user: reviewer,
        action: new_status == 'aprovado' ? 'approval' : 'review',
        from_status: 'em_revisao',
        to_status: new_status,
        comment: notes.present? ? notes : "Documento validado com sucesso."
      ) rescue nil

      render json: { success: true, message: "Gravado na base de dados com sucesso." }, status: :ok
    rescue => e
      render json: { error: "Erro de validação no banco: #{e.message}" }, status: :unprocessable_entity
    end
  end

  def export
    require 'csv'

    documents = DocumentItem.includes(:category, :document_versions).order('categories.name ASC')

    csv_data = CSV.generate(headers: true, col_sep: ',') do |csv|
      csv << ['Documento', 'Categoria', 'Versao', 'Validade', 'Status']
      
      documents.each do |doc|
        version = doc.document_versions.count > 0 ? doc.document_versions.count : 1
        due_date = doc.due_date ? doc.due_date.strftime('%d/%m/%Y') : 'Sem vencimento'
        
        csv << [
          doc.name,
          doc.category&.name || 'Geral',
          "v.#{version}",
          due_date,
          doc.status&.upcase || 'PENDENTE'
        ]
      end
    end

    send_data csv_data, filename: "checklist_cebas_#{Time.now.year}.csv", type: "text/csv"
  end

  def classify
    render json: { message: "Não implementado." }, status: :ok
  end
end