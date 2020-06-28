class Matchmaking

	@@text = "You're in a match, it start when either of the player press start. Be ready!"

	def self.make(first, second, match)
		if first.match == "none" && second.match == "none"
			first.update({ :status => "in a match with #{second.userid}",
						   :match => match });
			second.update({ :status => "in a match with #{first.userid}",
							:match => match });
			AlertsChannel.broadcast_to(first, { :text => @@text });
			AlertsChannel.broadcast_to(second, { :text => @@text });
		else
			nil;
		end
	end

end
