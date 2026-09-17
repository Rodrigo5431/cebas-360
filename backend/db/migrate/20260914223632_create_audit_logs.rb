class CreateAuditLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :audit_logs do |t|
      t.references :document_item, null: false, foreign_key: true
      t.references :document_version, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer  :action, null: false
      t.integer  :from_status
      t.integer  :to_status
      t.text     :comment
      t.datetime :created_at, null: false
    end
    add_index :audit_logs, [:document_item_id, :created_at]
  end
end