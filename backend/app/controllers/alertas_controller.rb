class AlertasController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def index
    docs_em_alerta = DocumentItem.where(status: ['pendente', 'correcao_solicitada'])
                                 .where("due_date <= ?", 15.days.from_now)
                                 .order(due_date: :asc)

    payload = docs_em_alerta.map do |doc|
      dias_restantes = (doc.due_date - Date.today).to_i
      tipo = dias_restantes < 0 ? "error" : "warning"
      mensagem = dias_restantes < 0 ? "O documento venceu há #{dias_restantes.abs} dias." : "O documento vence em #{dias_restantes} dias."
      
      { 
        id: doc.id, 
        titulo: "Prazo: #{doc.name}", 
        mensagem: mensagem, 
        data: doc.due_date.to_s,
        tipo: tipo
      }
    end

    render json: payload, status: :ok
  end

  def create
    render json: { message: "Alerta registrado." }, status: :created
  end
end