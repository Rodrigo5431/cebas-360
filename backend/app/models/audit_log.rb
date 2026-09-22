class AuditLog < ApplicationRecord
  belongs_to :document_item
  belongs_to :document_version, optional: true
  belongs_to :user

  enum :action, { upload: 0, approval: 1, correction_request: 2, status_change: 3 }

  STATUS_VALUES = {
    pendente: 0, em_revisao: 1, aprovado: 2,
    correcao_solicitada: 3, nao_aplicavel: 4
  }.freeze

  enum :from_status, STATUS_VALUES, prefix: true
  enum :to_status, STATUS_VALUES, prefix: true

  validates :comment, presence: true, if: -> { action == "correction_request" }
end