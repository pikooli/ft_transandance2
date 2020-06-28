class RemoveOfficer < ActiveRecord::Migration[6.0]
  def change
    add_column :users , :officer, :boolean , :default => false
    drop_table :officers
  end
end
