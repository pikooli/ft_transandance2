class Add2FaToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :TFA?, :boolean
  end
end
