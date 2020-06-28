class AddVictoriesLossesToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :victories, :integer, default: 0
    add_column :users, :losses, :integer, default: 0
  end
end
