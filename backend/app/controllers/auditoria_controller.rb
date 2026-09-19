class AuditoriaController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def state
    render json: { checked_items: {} }, status: :ok
  end

  def toggle
    item_name = params[:item_name]
    
    begin
      AuditLog.create!(
        action: "Simulação de Auditoria: verificação de '#{item_name}' alterada",
        user: current_user&.name || "Sistema"
      )
    rescue => e
      Rails.logger.error "Erro ao salvar log de auditoria: #{e.message}"
    end

    render json: { success: true, message: "Ação registada na trilha de auditoria com sucesso." }, status: :ok
  end
end