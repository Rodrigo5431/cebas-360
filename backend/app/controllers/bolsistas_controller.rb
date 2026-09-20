class BolsistasController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def index
    page = (params[:page] || 1).to_i
    per_page = 10
    
    query = Bolsista.all

    if params[:search].present?
      termo = "%#{params[:search]}%"
      query = query.where("name ILIKE :q OR cpf ILIKE :q OR course ILIKE :q OR status ILIKE :q", q: termo)
    end

    total_items = query.count
    total_pages = (total_items.to_f / per_page).ceil
    offset = (page - 1) * per_page

    bolsistas = query.order(name: :asc).limit(per_page).offset(offset)

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
    bolsista = Bolsista.new(bolsista_params)
    if bolsista.save
      render json: { message: "Bolsista cadastrado", id: bolsista.id }, status: :created
    else
      render json: { error: bolsista.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def update
    bolsista = Bolsista.find_by(id: params[:id])
    return render json: { error: "Bolsista não encontrado." }, status: :not_found unless bolsista

    if bolsista.update(bolsista_params)
      render json: { success: true, message: "Dados do bolsista atualizados." }, status: :ok
    else
      render json: { error: bolsista.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def destroy
    bolsista = Bolsista.find_by(id: params[:id])
    return render json: { error: "Bolsista não encontrado." }, status: :not_found unless bolsista

    bolsista.destroy
    render json: { success: true, message: "Bolsista removido da base." }, status: :ok
  end

  private

  def bolsista_params
    params.require(:bolsista).permit(:name, :cpf, :course, :scholarship_type, :income, :signed_term, :status)
  end
end