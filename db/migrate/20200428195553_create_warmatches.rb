class CreateWarmatches < ActiveRecord::Migration[6.0]
  def change
    create_table :warmatches do |t|
      t.references :guildwar, foreign_key: true
      t.string :challenger
      t.integer :guild_id
      t.timestamps
    end
  end
end
