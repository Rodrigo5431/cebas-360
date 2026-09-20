class DocumentComment < ApplicationRecord
  belongs_to :user
  belongs_to :document_item
end
