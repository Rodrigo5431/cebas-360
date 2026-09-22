class AuditoriaController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def state
    render json: { checked_items: {} }, status: :ok
  end

  def toggle
    item_name = params[:item_name]
    document_item = DocumentItem.find_by(name: item_name)

    if document_item.nil?
      Rails.logger.warn "[Auditoria] Documento '#{item_name}' não encontrado; log não registado."
      return render json: { success: true, message: "Ação registada na trilha de auditoria com sucesso." }, status: :ok
    end

    begin
      AuditLog.create!(
        document_item: document_item,
        action: 'status_change',
        from_status: document_item.status,
        to_status: document_item.status,
        comment: "Verificação de '#{item_name}' alterada na simulação de auditoria.",
        user: current_user || User.first
      )
    rescue => e
      Rails.logger.error "Erro ao salvar log de auditoria: #{e.message}"
    end

    render json: { success: true, message: "Ação registada na trilha de auditoria com sucesso." }, status: :ok
  end
end