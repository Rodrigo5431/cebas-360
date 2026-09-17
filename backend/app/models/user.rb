class User < ApplicationRecord
  has_secure_password
  has_many :document_versions, foreign_key: :uploaded_by_id, inverse_of: :uploaded_by
  has_many :reviewed_versions, class_name: "DocumentVersion", foreign_key: :reviewed_by_id
  has_many :audit_logs

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
end