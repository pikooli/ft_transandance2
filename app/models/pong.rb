class Pong

private
	def self.pong_score_user(victor, loser)
		victor.victories += 1;
		loser.losses += 1;
	end

	def self.pong_score_ladder(victor, loser)
		if victor.match == "ladder" && victor.rank > loser.rank
			victor.rank -= 1;
			loser.rank += 1;
		 end
	end

	def self.pong_score_deathmatch(loser)
		if loser.match == "deathmatch"
			Deathmatch.remove(loser);
		end
	end

	def self.pong_score_guild(player)
		Warmatch.finish(player)
		if player.guild
			player.guild.points += 1;
			player.guild.save();
		end
	end

public
	def self.pong_score_save(playerLeft, playerRight, scoreLeft, scoreRight)
		playerLeft.reload();
		playerRight.reload();
		if scoreLeft > scoreRight
			pong_score_guild(playerLeft);
			pong_score_ladder(playerLeft, playerRight);
			pong_score_deathmatch(playerRight);
			pong_score_user(playerLeft, playerRight);
		elsif scoreLeft < scoreRight
			pong_score_guild(playerRight);
			pong_score_ladder(playerRight, playerLeft);
			pong_score_deathmatch(playerLeft);
			pong_score_user(playerRight, playerLeft);
		end
		playerLeft.matches<<(Match.create({
			:playerLeft => playerLeft.userid,
			:playerRight => playerRight.userid,
			:scoreLeft => scoreLeft,
			:scoreRight => scoreRight,
			:matchType => playerLeft.match
			}));
		playerRight.matches<<(Match.create({
				:playerLeft => playerLeft.userid,
				:playerRight => playerRight.userid,
				:scoreLeft => scoreLeft,
				:scoreRight => scoreRight,
				:matchType => playerRight.match
				}));
		if playerLeft.status[0, 15] == "in a match with"
			playerLeft.status = "online";
		end
		if playerRight.status[0, 15] == "in a match with"
			playerRight.status = "online";
		end
		playerLeft.match = "none";
		playerRight.match = "none";
		playerLeft.save();
		playerRight.save();
	end

end
