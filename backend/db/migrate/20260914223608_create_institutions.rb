class CreateInstitutions < ActiveRecord::Migration[7.1]
  def change
    create_table :institutions do |t|
      t.string :name, null: false
      t.string :cnpj
      t.timestamps
    end
  end
end