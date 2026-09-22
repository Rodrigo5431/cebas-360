class DocumentVersion < ApplicationRecord
  belongs_to :document_item
  belongs_to :uploaded_by, class_name: "User"
  belongs_to :reviewed_by, class_name: "User", optional: true
  has_one_attached :file
  has_many :audit_logs

  enum :status, {
    pendente: 0, em_revisao: 1, aprovado: 2,
    correcao_solicitada: 3, nao_aplicavel: 4
  }

  validates :version_number, presence: true, uniqueness: { scope: :document_item_id }
  validates :correction_reason, presence: true, if: -> { status == "correcao_solicitada" }

  before_validation :set_version_number, on: :create

  private

  def set_version_number
    self.version_number ||= document_item.next_version_number
  end
end