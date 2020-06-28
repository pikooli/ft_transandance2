class PersochannelChannel < ApplicationCable::Channel
	def subscribed
		 stream_for params[:speudo]
	end

	def unsubscribed
		# Any cleanup needed when channel is unsubscribed
	end
end
