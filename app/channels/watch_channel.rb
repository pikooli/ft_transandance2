class WatchChannel < ApplicationCable::Channel
	def follow(data)
		user = User.find_by(:userid => data["userid"]);
		stream_for(user);
	end

	def unfollow
		stop_all_streams();
	end
end
