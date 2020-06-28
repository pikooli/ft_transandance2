class RoomlobbyChannel < ApplicationCable::Channel
	def subscribed
		 stream_from "RoomlobbyChannel"
	end

	def unsubscribed
		# Any cleanup needed when channel is unsubscribed
	end
end
