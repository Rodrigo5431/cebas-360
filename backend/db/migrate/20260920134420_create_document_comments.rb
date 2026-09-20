class CreateDocumentComments < ActiveRecord::Migration[8.1]
  def change
    create_table :document_comments do |t|
      t.text :body
      t.references :user, null: false, foreign_key: true
      t.references :document_item, null: false, foreign_key: true

      t.timestamps
    end
  end
end
