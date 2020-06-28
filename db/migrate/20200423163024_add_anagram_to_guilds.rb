class AddAnagramToGuilds < ActiveRecord::Migration[6.0]
  def change
    add_column :guilds, :anagram, :string
    add_index :guilds, :anagram, unique: true
  end
end
