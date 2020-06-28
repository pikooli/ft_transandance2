class AddOfficiersRemoveOfficier < ActiveRecord::Migration[6.0]
  def change
    drop_table :officers
    create_table :officers do |t|
      t.string :username
      t.references :guild, foreign_key: true
      t.timestamps
    end
  end
end
