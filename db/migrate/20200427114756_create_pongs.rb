class CreatePongs < ActiveRecord::Migration[6.0]
  def change
    create_table :pongs do |t|
      t.timestamps
    end
    add_column :users, :pong, :bigint, :default => nil
  end
end
