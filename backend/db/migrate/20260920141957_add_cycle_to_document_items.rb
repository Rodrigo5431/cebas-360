class AddCycleToDocumentItems < ActiveRecord::Migration[8.1]
  def change
    add_column :document_items, :cycle, :string
  end
end
