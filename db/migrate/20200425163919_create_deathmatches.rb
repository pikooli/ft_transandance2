class CreateDeathmatches < ActiveRecord::Migration[6.0]
  def change
    create_table :deathmatches do |t|
      t.string :state
      t.datetime :begin
      t.timestamps
    end

    add_reference :users, :deathmatch, foreign_key: true
  end
end
