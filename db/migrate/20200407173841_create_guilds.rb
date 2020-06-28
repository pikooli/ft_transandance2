class CreateGuilds < ActiveRecord::Migration[6.0]
	def change
		create_table :guilds do |t|
			t.string :guildname, index: {unique: true}
			t.timestamps
		end

		add_reference :users, :guild, foreign_key: true
	end
end
