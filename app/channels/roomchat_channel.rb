class RoomchatChannel < ApplicationCable::Channel

	def subscribed
		@roomchat = Roomchat.find_by(roomname: params[:room])
		user = User.find_by(speudo: params[:speudo])
		if user
			if user.admin == false
				user.update(roomchat_id: @roomchat.id)
			end
		end
		stream_from params[:room]
		preparelistuser(@roomchat)
	end

	def receive(data)
	end

	def unsubscribed
			@user = User.find_by(speudo: params[:speudo])
			if @user
					@user.update(roomchat_id: nil)
				@roomchat = Roomchat.find_by(roomname: params[:room])
				if @roomchat
					listuser = @roomchat.users.order("updated_at")
					if listuser.length > 0
						if @roomchat.owner == params[:speudo]
								@roomchat.update(owner: listuser.first.speudo)
								@roomchat.admins.create(speudo: listuser.first.speudo)
						end
						preparelistuser(@roomchat)
					else
						@roomchat.destroy
						sendlistroom
					end
				end
			end
	end


	# -------------------------------------------------------------------------

	def printsomething(message)
		puts "\033[0;32m"
		puts message
		puts "\033[0;0m"
	end

	def isban(banlist)
		if banlist
			banlist.each do |t|
				if t.speudo == params[:speudo]
					time = Time.new
					if (time.to_i - t.updated_at.to_i) > t.timeban
						t.destroy
						return false
					end
					return true
				end
			end
		end
		return false
	end


	def sendlistroom
		hash = Hash.new

		rooms = Roomchat.where('id > ?', 1)
		i = 0
		rooms.each do |room|
			hash.store(i+=1, room)
			i+1
		end
		ActionCable.server.broadcast 'RoomlobbyChannel',
									chatroomlobby: hash
	end

	def preparelistuser(roomchat)
		hash = Hash.new
		listuser = roomchat.users.order("updated_at")
		i = 0
		listuser.each do |teste|
			hash.store(i+=1, teste)
		end		
		ActionCable.server.broadcast params[:room],
									listuser: hash
	end

end
