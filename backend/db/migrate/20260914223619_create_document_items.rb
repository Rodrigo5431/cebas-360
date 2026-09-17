class CreateDocumentItems < ActiveRecord::Migration[7.1]
  def change
    create_table :document_items do |t|
      t.references :institution, null: false, foreign_key: true
      t.references :category, null: false, foreign_key: true
      t.string  :name, null: false
      t.text    :orientation
      t.boolean :mandatory, null: false, default: true
      t.date    :due_date
      t.integer :status, null: false, default: 0
      t.integer :position, null: false, default: 0
      t.timestamps
    end
    add_index :document_items, [:institution_id, :status]
    add_index :document_items, [:institution_id, :category_id]
  end
end