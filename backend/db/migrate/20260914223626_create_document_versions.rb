class CreateDocumentVersions < ActiveRecord::Migration[7.1]
  def change
    create_table :document_versions do |t|
      t.references :document_item, null: false, foreign_key: true
      t.references :uploaded_by, null: false, foreign_key: { to_table: :users }
      t.references :reviewed_by, foreign_key: { to_table: :users }
      t.integer  :version_number, null: false
      t.integer  :status, null: false, default: 0
      t.text     :correction_reason
      t.datetime :reviewed_at
      t.timestamps
    end
    add_index :document_versions, [:document_item_id, :version_number], unique: true
  end
end