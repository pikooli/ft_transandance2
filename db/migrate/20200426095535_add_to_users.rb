class AddToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :deathmatch, :integer, :default => 0
    add_column :users, :admin, :boolean, :default => false
  end
end
