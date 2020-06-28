class CreateMatches < ActiveRecord::Migration[6.0]
  def change
    create_table :matches do |t|
      t.string :playerLeft
      t.string :playerRight
      t.integer :scoreLeft
      t.integer :scoreRight
      t.string :matchType

      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
