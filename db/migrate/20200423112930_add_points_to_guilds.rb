class AddPointsToGuilds < ActiveRecord::Migration[6.0]
  def change
    add_column :guilds, :points, :integer, :default => 0
  end
end
