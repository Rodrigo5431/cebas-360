class BolsistasController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def index
    page = (params[:page] || 1).to_i
    per_page = 10
    
    offset = (page - 1) * per_page
    total_items = Bolsista.count
    total_pages = (total_items.to_f / per_page).ceil

    bolsistas = Bolsista.order(name: :asc).limit(per_page).offset(offset)

    payload = {
      data: bolsistas.map do |b|
        { 
          id: b.id, 
          name: b.name, 
          cpf: b.cpf, 
          course: b.course, 
          scholarship_type: b.scholarship_type, 
          income: b.income, 
          signed_term: b.signed_term, 
          status: b.status 
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

  def create
    bolsista = Bolsista.create!(bolsista_params)
    render json: { message: "Bolsista cadastrado", id: bolsista.id }, status: :created
  end

  private

  def bolsista_params
    params.require(:bolsista).permit(:name, :cpf, :course, :scholarship_type, :income, :signed_term, :status)
  end
end