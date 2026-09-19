class DashboardController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def show
    @institution = Institution.first || Institution.new(name: "Instituição Padrão")

    @document_items = @institution.document_items.includes(:category)
    total_docs = @document_items.count
    approved_docs = @document_items.where(status: 'aprovado').count
    completion = total_docs > 0 ? ((approved_docs.to_f / total_docs) * 100).round : 0
    
    status_counts = @document_items.group(:status).count

    upcoming = Alerta.order(due_date: :asc).limit(4).map do |alerta|
      {
        id: alerta.id,
        name: alerta.titulo,
        category: alerta.category,
        due_date: alerta.due_date.to_s,
        tipo: alerta.tipo
      }
    end

    integrais = Bolsista.where("scholarship_type ILIKE ?", "%Integral%").count
    parciais = Bolsista.where("scholarship_type ILIKE ?", "%Parcial%").count

    equivalente_ofertado = integrais + (parciais / 2.0)
    
    pagantes_simulados = integrais > 0 ? (integrais * 4.8).to_i : 1380
    
    bolsas_target = (pagantes_simulados / 5.0).ceil 

    grat_current = pagantes_simulados > 0 ? ((equivalente_ofertado / pagantes_simulados.to_f) * 100).round(2) : 0
    grat_target = 20.0 

    dias_restantes = 301
    validade = Date.current + dias_restantes.days

    base_forecast = [40, 48, 52, 58, 65, 70, 78, 85, 90, 95]
    base_forecast << (grat_current > 0 ? (grat_current * 4.2).to_i : 98) 
    base_forecast << 100 

    payload = {
      institution: {
        id: @institution.id,
        name: @institution.name,
        cnpj: @institution.cnpj
      },
      completion_percentage: completion,
      status_counts: status_counts,
      upcoming_deadlines: upcoming,
      certificate: {
        portaria: "Portaria MEC nº 482/#{Date.current.year - 2}",
        valid_until: validade.to_s,
        renewal_start: (validade - 360.days).to_s,
        renewal_end: validade.to_s,
        days_remaining: dias_restantes
      },
      gratuidade: {
        current_percentage: grat_current,
        target_percentage: grat_target,
        equivalent_scholarships: equivalente_ofertado,
        growth: 3.2
      },
      bolsas: {
        ratio: '1/5',
        current: integrais,
        target: bolsas_target
      },
      forecast_data: base_forecast,
      forecast_confidence: 82
    }

    render json: payload, status: :ok
  end
end