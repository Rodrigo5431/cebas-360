class DocumentsController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def index
    page = (params[:page] || 1).to_i
    per_page = 10

    query = DocumentItem.includes(:category, :document_versions).joins(:category)

    if params[:search].present?
      termo = "%#{params[:search]}%"
      query = query.where("document_items.name ILIKE :q OR categories.name ILIKE :q OR document_items.status ILIKE :q", q: termo)
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
              uploaded_by: v.try(:uploaded_by),
              reviewed_by: v.try(:reviewed_by)
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
    category_slug = params[:category]
    file = params[:file]
    user_name = params[:user_name] || 'Instituição (Cliente)'

    category = Category.where("name ILIKE ?", "%#{category_slug}%").first
    return render json: { error: 'Categoria não encontrada.' }, status: :not_found unless category

    document_item = DocumentItem.find_or_create_by(category: category, name: file.original_filename) do |doc|
      doc.status = 'em_revisao'
    end

    current_version_number = document_item.document_versions.maximum(:version_number) || 0
    next_version = current_version_number + 1

    document_item.document_versions.create!(
      version_number: next_version,
      status: 'em_revisao',
      uploaded_by: user_name
    )

    document_item.update!(status: 'em_revisao')

    render json: { success: true, message: "Upload da versão #{next_version} registado com sucesso." }, status: :created
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def review
    document_item = DocumentItem.find_by(id: params[:id])
    return render json: { error: 'Documento não encontrado.' }, status: :not_found unless document_item

    new_status = params[:status]
    notes = params[:notes]
    user_name = params[:user_name] || 'Advogado Compliance'

    if new_status == 'correcao_solicitada' && notes.blank?
      return render json: { error: 'É obrigatório informar o motivo da recusa para a instituição.' }, status: :unprocessable_entity
    end

    document_item.update!(status: new_status)

    latest_version = document_item.document_versions.order(version_number: :desc).first
    if latest_version
      latest_version.update!(
        status: new_status,
        correction_reason: notes,
        reviewed_by: user_name,
        reviewed_at: Time.current
      )
    end

    render json: { success: true, message: "Conferência registada com sucesso na trilha de auditoria." }, status: :ok
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
    render json: { message: "Classificação gerida pelo Front-end na MVP atual." }, status: :ok
  end
end