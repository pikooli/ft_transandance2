class RoomchatController < ApplicationController

	#after_action do
	#	puts response.body;
	#end

	def index
		render(:json => Roomchat.all());
	end

	def create
		@room = Roomchat.find_by(roomname: params[:roomname])
		if @room
			sendpersonnal(params[:speudo], error: "a room with the name " + @room.roomname + " already exist")
		else
			@room = Roomchat.new
			@room.roomname = params[:roomname]
			@room.owner = params[:speudo]
			@room.password = params[:password] + "42"
			if @room.save
				@room.admins.create(speudo: params[:speudo])
				ActionCable.server.broadcast 'RoomlobbyChannel',
											newroomchat: @room.roomname
			end
		end
	end

	def join
		@room = Roomchat.includes('banlists').find_by(roomname: params[:roomname])
		if !@room
			return
		end
		user = User.find_by(username: params[:speudo])
		if 	!user.admin
			if @room.password
				if @room.password != params[:password] + "42"
					render :json => {:password => true}
					return
				end
			end
			if find_in_list(@room.banlists, params[:speudo]) != false
				render :json => {:erros => true}
				return
			end
		end
		render :json => {:room => params[:roomname],:erros => false}
	end

	def ban

		if !User.find_by(speudo: params[:banspeudo])
			sendpersonnal(params[:admin], error: "no user with this name: " + params[:banspeudo])
		else
			@room = Roomchat.find_by(roomname: params[:roomname])
			user = User.find_by(username: params[:admin])
			if !isInside(@room.admins, params[:admin]) && !user.admin
				sendpersonnal(params[:admin], error: "you are not a admin")
				return true
			end

			banlist = @room.banlists
			if params[:time]
				if params[:time].to_i == 0
					sendpersonnal(params[:admin], error: "bad time ban")
					return true
				end
				bantime = (params[:time].to_i * 60)
			else
				bantime = 999999999
			end

			banlist.each do |t|
				if t.speudo == params[:banspeudo]
					t.timeban = bantime
					t.save
					sendnotive(@room.roomname, "new bantime for " + params[:banspeudo] + " is " + bantime.to_s + ' min')
					return true
				end
			end

			banlist.create(speudo: params[:banspeudo], timeban: bantime)
			sendnotive(@room.roomname, params[:banspeudo] + " have been ban for " + bantime.to_s + " min")
			sendpersonnal(params[:banspeudo], ban: @room.roomname)
		end
	end


	def unban
		@room = Roomchat.includes('banlists', 'admins').find_by(roomname: params[:roomname])
		user = User.find_by(username: params[:admin])

		if isAdmin(@room.admins) || user.admin
			ban = find_in_list(@room.banlists, params[:banspeudo])
			if ban != false
				ban.destroy
				sendnotive(@room.roomname, params[:banspeudo] + " have been unban")
				return true
			end
		else
			sendpersonnal(params[:admin], error: "you are not a admin")
			return true
		end
		sendpersonnal(params[:admin], error: "user was not ban")
	end

	def admin
		@room = Roomchat.find_by(roomname: params[:roomname])
		user = User.find_by(username: params[:owner])
		if @room.owner == params[:owner] || user.admin
			@room.admins.create(speudo: params[:admin])
			render :json => {:content => true}
			return
		end
		render :json => {:content => false}
	end

	def unadmin
		@room = Roomchat.find_by(roomname: params[:roomname])
		user = User.find_by(username: params[:owner])
		if @room.owner == params[:owner] || user.admin
			admin = Admin.find_by(speudo: params[:admin])
			if admin
				admin.destroy
			end
			render :json => {:content => true}
			return
		end
		render :json => {:content => false}
	end

	def password
		@room = Roomchat.find_by(roomname: params[:roomname])
		if !@room
			render :json => {:content => false}
			return
		end
		if @room.owner == params[:owner]
			@room.update(password: params[:password])
			render :json => {:content => true}
			return
		end
		render :json => {:content => false}
	end

	def unpassword
		@room = Roomchat.find_by(roomname: params[:roomname])
		if !@room
			render :json => {:content => false}
			return
		end
		if @room.owner == params[:owner]
			@room.update(password: '')
			render :json => {:content => true}
			return
		end
		render :json => {:content => false}
	end

	def game
		player = User.where(:status => "online").find_by(:username => params[:player]);
		enemy = User.where(:status => "online").find_by(:username => params[:enemy]);
		checkuser = User.find_by(username: params[:enemy])
		if player && enemy && Matchmaking.make(player, enemy, "duel")
			render(:json => {:content => true});
		else
			if !enemy && !checkuser
				render(:json => {:content => false, :message => "nobody with this name :" + params[:enemy]});
			else
				render(:json => {:content => false, :message => params[:enemy] + " already in a game"});
			end
		end
	end

	def destroy
		chat = Roomchat.find_by(roomname: params[:roomname])
		user = User.find_by(username: params[:username])
		if user && chat
			if user.admin == true
				senddestroy(chat.roomname, "room is destroy")
			else
				sendpersonnal(user.username, "your cannot do this")
			end
		end
	end
			
# ---------------------------------------------------------------------------------------

	private

	def senddestroy(room, content)
		ActionCable.server.broadcast room,
						destroy:  content
	end


	def sendnotive(room, content)
		ActionCable.server.broadcast room,
						notive:  content
	end

	def sendpersonnal(speudo, content)
		PersochannelChannel.broadcast_to speudo,
									content
	end

	def isAdmin(adminList)
		if isInside(adminList, params[:admin])
			return true
		end
		return false
	end

	def find_in_list(list, speudo)
		list.each do |t|
			if t.speudo == speudo
				return t
			end
		end
		return false
	end

	def isInside(list, speudo)
		list.each do |t|
			if (t.speudo == speudo)
				return true
			end
		end
		return false
	end
end

