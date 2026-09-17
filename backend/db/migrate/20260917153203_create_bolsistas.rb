class CreateBolsistas < ActiveRecord::Migration[8.1]
  def change
    create_table :bolsistas do |t|
      t.string :name
      t.string :cpf
      t.string :course
      t.string :scholarship_type
      t.decimal :income
      t.boolean :signed_term
      t.string :status

      t.timestamps
    end
  end
end
