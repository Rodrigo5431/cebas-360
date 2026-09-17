class AuditoriaController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def index
    logs = AuditLog.includes(document_version: :document_item).order(created_at: :desc)
    
    payload = logs.map do |log|
      { 
        id: log.id, 
        document_name: log.document_version&.document_item&.name || "Documento Excluído", 
        action: log.action,
        from_status: log.from_status,
        to_status: log.to_status,
        comment: log.comment,
        date: log.created_at.to_s
      }
    end

    render json: payload, status: :ok
  end

  def toggle
    render json: { message: "Ação não aplicável" }, status: :ok
  end
end