class User < ApplicationRecord
	belongs_to(:guild, :optional => true);
	has_one_attached(:avatar);

	has_and_belongs_to_many(:friends,
							:class_name => "User",
							:join_table => :friendships,
							:foreign_key => :user_id,
							:association_foreign_key => :friend_user_id);

	validates(:userid, :uniqueness => true);
	validates(:username, :uniqueness => true);

	# ---- Chat room ----
	belongs_to(:roomchat, :optional => true);
	has_many(:mutes, :dependent => :destroy);

	alias_attribute(:speudo, :username);

	# ---- Match ----
	has_many(:matches);


	def self.Broadcast_to_all(message)
		users = User.where.not(status: 'offline')
		if users
			users.each do |t|
				PersochannelChannel.broadcast_to t.username,
												{error: message}
			end
		end
	end

end
