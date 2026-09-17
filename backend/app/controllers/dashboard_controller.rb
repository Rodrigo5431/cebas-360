class DashboardController < ApplicationController
  def show
    @institution = Institution.first
    @document_items = @institution.document_items.includes(:document_versions)
    
    total_docs = @document_items.count
    approved_docs = @document_items.where(status: 'aprovado').count
    completion = total_docs > 0 ? ((approved_docs.to_f / total_docs) * 100).round : 0

    status_counts = @document_items.group(:status).count

    items_attention = @document_items.where(status: 'correcao_solicitada').map do |item|
      last_version = item.document_versions.order(version_number: :desc).first
      { 
        id: item.id, 
        name: item.name, 
        category: item.category_name, 
        reason: last_version&.correction_reason 
      } 
    end

    upcoming = @document_items.where(status: ['pendente', 'em_revisao'])
                              .where("due_date <= ?", 15.days.from_now)
                              .order(due_date: :asc).map do |item|
      { 
        id: item.id, 
        name: item.name, 
        category: item.category_name, 
        due_date: item.due_date 
      }
    end

    payload = {
      institution: {
        id: @institution.id,
        name: @institution.name,
        cnpj: @institution.cnpj
      },
      completion_percentage: completion,
      status_counts: status_counts,
      items_requiring_attention: items_attention,
      upcoming_deadlines: upcoming
    }

    self.status = 200
    self.content_type = "application/json"
    self.response_body = payload.to_json
  end
end