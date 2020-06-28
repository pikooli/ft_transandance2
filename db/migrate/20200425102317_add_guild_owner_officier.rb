class AddGuildOwnerOfficier < ActiveRecord::Migration[6.0]
  def change
    add_column :guilds , :owner ,:string
    create_table :officers do |t|
      t.string :username
      t.references :guild, foreign_key: true
      t.timestamps
    end
  end
end
