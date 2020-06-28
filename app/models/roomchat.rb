class Roomchat < ApplicationRecord
	has_many :users
	has_many :banlists, dependent: :destroy
	has_many :admins, dependent: :destroy

end
