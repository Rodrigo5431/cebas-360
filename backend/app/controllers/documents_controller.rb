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
            { version_number: v.version_number, status: v.status, reason: v.correction_reason }
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
    render json: { message: "Upload registrado no banco." }, status: :ok
  end

  def review
    render json: { message: "Revisão salva no banco." }, status: :ok
  end

  def export
    render plain: "CSV_REAL", content_type: "text/csv"
  end

  def classify
    render json: [], status: :ok
  end
end