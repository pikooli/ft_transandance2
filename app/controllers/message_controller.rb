class MessageController < ApplicationController
	def chatroom
		room = Roomchat.find_by(roomname: params[:roomname])
		if !room
			return
		end
		room.banlists.each do |t|
			if t.speudo == params[:speudo]
					PersochannelChannel.broadcast_to params[:speudo],
												banned: room.roomname
					return true
			end
		end
		ActionCable.server.broadcast params[:roomname],
									anagram: params[:anagram],
									name: params[:speudo],
									content: params[:content]
	end
end
