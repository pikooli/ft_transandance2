class AddToGuild < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :G_anagram, :string
    add_reference :guilds, :user, index: true 
    add_foreign_key :guilds, :users
  end
end
