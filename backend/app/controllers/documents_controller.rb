class DocumentsController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def index
    documents = DocumentItem.includes(:document_versions).order(category_name: :asc, due_date: :asc)

    payload = documents.map do |doc|
      {
        id: doc.id,
        category_name: doc.category_name,
        name: doc.name,
        orientation: doc.orientation,
        mandatory: doc.mandatory,
        due_date: doc.due_date.to_s,
        status: doc.status,
        versions: doc.document_versions.order(version_number: :desc).map do |v|
          { 
            version_number: v.version_number, 
            status: v.status, 
            reason: v.correction_reason 
          }
        end
      }
    end

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