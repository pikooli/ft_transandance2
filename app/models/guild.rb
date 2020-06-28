class Guild < ApplicationRecord
	has_many(:users);
	has_many :primary_guildwars, class_name: "Guildwar", foreign_key: "guild_1_id"
	has_many :secondary_guilswars, class_name: "Guildwar", foreign_key: "guild_2_id"
	validates(:guildname, :uniqueness => true);
	validates(:anagram, :uniqueness => true);

end
