class CreateGuildwars < ActiveRecord::Migration[6.0]
  def change
    create_table :guildwars do |t|
      t.references :guild_1, index: true ,foreign_key: {to_table: :guilds}
      t.references :guild_2, index: true ,foreign_key: {to_table: :guilds}
      t.string :guildname_1
      t.string :guildanagram_1
      t.string :guildname_2
      t.string :guildanagram_2
      t.integer :pointbet, default: 0 
      t.boolean :addon ,default: false
      t.integer :setunwanswered, default: 0 
      t.boolean :guild_1_accept, default: true
      t.boolean :guild_2_accept, default: false
      t.boolean :finish, default: false
      t.integer :point_1, default: 0
      t.integer :point_2, default: 0
      t.boolean :wartime ,default: true
      t.integer :unanswered , default: 0
      t.datetime :start
      t.datetime :end
      t.timestamps
    end
  end
end