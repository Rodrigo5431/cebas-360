class DocumentItem < ApplicationRecord
  belongs_to :institution, optional: true
  belongs_to :category
  has_many :document_versions, -> { order(version_number: :desc) }, dependent: :destroy
  has_many :document_comments, dependent: :destroy
  has_many :audit_logs, dependent: :destroy

  enum :status, {
    pendente: 0, em_revisao: 1, aprovado: 2,
    correcao_solicitada: 3, nao_aplicavel: 4
  }

  validates :name, presence: true

  scope :com_prazo_proximo, ->(dias = 5) { where(due_date: Date.current..dias.days.from_now) }
  scope :requer_atencao, -> { where(status: :correcao_solicitada) }

  def current_version = document_versions.first
  def next_version_number = (document_versions.maximum(:version_number) || 0) + 1
end