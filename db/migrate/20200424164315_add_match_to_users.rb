class AddMatchToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :match, :string, :default => "none"
  end
end
