class CreateAlerta < ActiveRecord::Migration[8.1]
  def change
    create_table :alerta do |t|
      t.string :titulo
      t.string :category
      t.text :mensagem
      t.date :due_date
      t.string :tipo

      t.timestamps
    end
  end
end
