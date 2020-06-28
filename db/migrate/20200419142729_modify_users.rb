class ModifyUsers < ActiveRecord::Migration[6.0]
  def change
    add_reference :users, :roomchat

    create_table :roomchats do |t|
      t.string :roomname
      t.string :owner
      t.string :password

      t.timestamps
    end

    create_table :banlists do |t|
      t.string :speudo
      t.references :roomchat
      t.integer :timeban

      t.timestamps
    end

    create_table :admins do |t|
      t.string :speudo
      t.references :roomchat

      t.timestamps
    end

    create_table :mutes do |t|
      t.string :speudo
      t.references :user, null: false

      t.timestamps
    end

  end

end
