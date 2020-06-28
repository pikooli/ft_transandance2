class DropPongs < ActiveRecord::Migration[6.0]
  def change
    drop_table :pongs
  end
end
