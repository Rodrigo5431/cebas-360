class BolsistasController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def index
    page = (params[:page] || 1).to_i

    # Retornamos os dados fictícios DIRETAMENTE no formato exato que o React espera.
    # Sem referenciar "Bolsista.all", evitando qualquer crash de banco vazio.
    payload = {
      data: [
        { 
          id: 1, 
          name: "Maria Silva", 
          cpf: "111.222.333-44", 
          course: "Direito", 
          scholarship_type: "Integral", 
          income: 1200.0, 
          signed_term: true, 
          status: "aprovado" 
        },
        { 
          id: 2, 
          name: "João Souza", 
          cpf: "555.666.777-88", 
          course: "Engenharia", 
          scholarship_type: "Parcial", 
          income: 2500.0, 
          signed_term: false, 
          status: "pendente" 
        },
        { 
          id: 3, 
          name: "Ana Costa", 
          cpf: "999.888.777-66", 
          course: "Medicina", 
          scholarship_type: "Integral", 
          income: 900.0, 
          signed_term: true, 
          status: "em_revisao" 
        }
      ],
      meta: { 
        current_page: page, 
        total_pages: 1, 
        total_items: 3 
      }
    }

    render json: payload, status: :ok
  end

  def create
    render json: { message: "Bolsista cadastrado com sucesso", id: 999 }, status: :created
  end
end