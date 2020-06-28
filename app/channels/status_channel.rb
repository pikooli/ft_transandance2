class StatusChannel < ApplicationCable::Channel
	def subscribed
		current_user.status = "online";
		current_user.save();
	end

	def unsubscribed
		current_user.status = "offline";
		current_user.save();
	end
end
