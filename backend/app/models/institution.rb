class Institution < ApplicationRecord
  has_many :document_items, dependent: :destroy

  def status_counts
    document_items.group(:status).count
  end

  def completion_percentage
    total = document_items.count
    return 0 if total.zero?
    
    aprovados = document_items.aprovado.count
    ((aprovados.to_f / total) * 100).round
  end
end