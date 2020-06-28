class Tournament

	def self.join(user)
		if User.where(:rank => 1).size() == 0
			user.rank = 1;
			user.save();
		elsif User.where(:rank => 2).size() == 0
			user.rank = 2;
			user.save();
		elsif User.where(:rank => 3).size() == 0
			user.rank = 3;
			user.save();
		elsif User.where(:rank => 4).size() == 0
			user.rank = 4;
			user.save();
		else
			user.rank = 5;
			user.save();
		end
	end

	def self.challenge(user)
		if user.rank == 0
			join(user);
		end
		if user.rank == 1
			nil;
		else
			players = User.where({ :rank => (user.rank - 1),
								   :status => "online" }).all();
			if players.size() == 0
				nil;
			else
				players.shuffle().first();
			end
		end
	end

end
