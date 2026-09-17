class AlertasController < ApplicationController
  # O "raise: false" previne o erro 500 caso o callback nativo não exista na sua versão
  skip_before_action :verify_authenticity_token, raise: false

  def index
    payload = [
      { 
        id: 1, 
        titulo: "Documento Pendente", 
        mensagem: "O Estatuto Social vence em 5 dias.", 
        data: Date.today.to_s,
        tipo: "warning"
      }
    ]

    # Usando o método nativo e seguro do Rails
    render json: payload, status: :ok
  end

  def create
    render json: { message: "Alerta registrado com sucesso." }, status: :created
  end
end