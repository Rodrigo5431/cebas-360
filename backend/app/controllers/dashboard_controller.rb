class DashboardController < ApplicationController
  def show
    @institution = Institution.first
    @document_items = @institution.document_items.includes([:category, :document_versions])
    
    # Montando a estrutura de dados que o React vai consumir
    payload = {
      institution: {
        id: @institution.id,
        name: @institution.name,
        cnpj: @institution.cnpj
      },
      completion_percentage: @institution.completion_percentage,
      status_counts: @institution.status_counts,
      items_requiring_attention: @document_items.requer_atencao.map { |item| 
        { 
          id: item.id, 
          name: item.name, 
          category: item.category.name, 
          reason: item.current_version&.correction_reason 
        } 
      },
      # Usando string no order() para evitar o bug de kwargs do Ruby
      upcoming_deadlines: @document_items.com_prazo_proximo(15).order("due_date ASC").map { |item|
        { 
          id: item.id, 
          name: item.name, 
          category: item.category.name, 
          due_date: item.due_date 
        }
      }
    }

    # Retornando a árvore completa
    self.status = 200
    self.content_type = "application/json"
    self.response_body = payload.to_json
  end
end