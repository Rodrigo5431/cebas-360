class AlertasController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def index
    alertas_manuais = Alerta.all.order(due_date: :asc)
    
    payload = alertas_manuais.map do |alerta|
      {
        id: alerta.id,
        titulo: alerta.titulo,
        name: alerta.titulo, 
        category: alerta.category,
        mensagem: alerta.mensagem,
        data: alerta.due_date.to_s,
        due_date: alerta.due_date.to_s,
        tipo: alerta.tipo
      }
    end

    render json: payload, status: :ok
  end

  def create
    alerta = Alerta.create!(alerta_params)
    render json: { success: true, message: "Alerta registrado.", id: alerta.id }, status: :created
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def update
    alerta = Alerta.find(params[:id])
    alerta.update!(alerta_params)
    render json: { success: true, message: "Alerta atualizado com sucesso." }, status: :ok
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def destroy
    alerta = Alerta.find(params[:id])
    alerta.destroy
    render json: { success: true, message: "Alerta removido." }, status: :ok
  end

  private

  def alerta_params
    params.require(:alerta).permit(:titulo, :category, :mensagem, :due_date, :tipo)
  end
end