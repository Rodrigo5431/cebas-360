class Category < ApplicationRecord
  has_many :document_items, dependent: :restrict_with_error
  validates :name, presence: true, uniqueness: true
  default_scope { order(:position) }
end