class Guildwar < ApplicationRecord
	belongs_to :guild_1, class_name: "Guild", optional: true
	belongs_to :guild_2, class_name: "Guild", optional: true
	has_many :warmatchs ,dependent: :destroy
	
end
