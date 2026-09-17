class AuditLog < ApplicationRecord
  belongs_to :document_item
  belongs_to :document_version, optional: true
  belongs_to :user

  enum :action, { upload: 0, approval: 1, correction_request: 2, status_change: 3 }
  
  validates :comment, presence: true, if: -> { action == "correction_request" }
end