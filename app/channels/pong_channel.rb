class PongChannel < ApplicationCable::Channel
	def subscribed
		stream_for(current_user);
	end

	def unsubscribed
		@playerLeft = nil;
		@playerRight = nil;
	end

	def start(data)
		@playerLeft = User.find_by(:userid => data["playerLeft"]);
		@playerRight = User.find_by(:userid => data["playerRight"]);
		data = {
			:action => 4,
			:playerLeft => data["playerLeft"],
			:playerRight => data["playerRight"]
		};
		if current_user == @playerLeft
			data[:host] = true;
			PongChannel.broadcast_to(@playerLeft, data);
			data[:host] = false;
			PongChannel.broadcast_to(@playerRight, data);
		elsif current_user == @playerRight
			data[:host] = false;
			PongChannel.broadcast_to(@playerLeft, data);
			data[:host] = true;
			PongChannel.broadcast_to(@playerRight, data);
		end
	end

	def stop(data)
		identify_players(data);
		PongChannel.broadcast_to(@playerLeft, { :action => 1 });
		PongChannel.broadcast_to(@playerRight, { :action => 1 });
	end

	def direction(data)
		identify_players(data);
		if current_user == @playerLeft
			data = { :action => 2, :direction => data["direction"] };
		elsif current_user == @playerRight
			data = { :action => 3, :direction => data["direction"] };
		end
		PongChannel.broadcast_to(@playerLeft, data);
		PongChannel.broadcast_to(@playerRight, data);
	end

	def score(data)
		identify_players(data);
		Pong.pong_score_save(
			@playerLeft,
			@playerRight,
			data["score"]["left"],
			data["score"]["right"]
		);
	end

	def broadcast(data)
		identify_players(data);
		PongChannel.broadcast_to(@playerLeft, data["attributes"]);
		PongChannel.broadcast_to(@playerRight, data["attributes"]);
		WatchChannel.broadcast_to(@playerLeft, data["attributes"]);
		WatchChannel.broadcast_to(@playerRight, data["attributes"]);
	end

	def reset(data)
		@playerLeft = User.find_by(:userid => data["playerLeft"]);
		@playerRight = User.find_by(:userid => data["playerRight"]);
		data[:action] = 0;
		if current_user == @playerLeft
			PongChannel.broadcast_to(@playerLeft, data);
		elsif current_user == @playerRight
			PongChannel.broadcast_to(@playerRight, data);
		end
	end

private
	def identify_players(data)
		@playerLeft ||= User.find_by(:userid => data["playerLeft"]);
		@playerRight ||= User.find_by(:userid => data["playerRight"]);
	end

end
