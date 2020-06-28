class GuildsController < ApplicationController

	def index
		guilds = Guild.all();
		render(:json => guilds);
	end

	def create
		permitted = params.require("guild").permit(:guildname, :anagram ,:owner);
		guild = Guild.new(permitted);
		if guild.save() == false
			render(:json => guild.errors.full_messages,
				   :status => :not_acceptable);
		else
			render(:json => guild);
		end
	end

	def edit
		user = User.find_by(:id => session[:user_id]);
		guild = Guild.find_by(:guildname => params[:id]);
		user.update({ :guild_id => guild.id , :G_anagram => guild.anagram, :officer => false});
		session[:guild_id] = guild.id;
		render(:json => guild);
	end

	def show
		if (session[:guild_id] == nil)
			render(:json => { :error => true });
		else
			render(:json => Guild.find_by(:id => session[:guild_id]));
		end
	end

	def showOfficer
		guild = Guild.find_by(id: params[:id])
		if !guild
			return
		end
		render(:json => guild.users.where(officer: true))
	end

	def createOfficer
		guild = Guild.find_by(id: params[:idguild])
		user = guild.users.find_by(username: params[:username])
		user.update(officer: true);
	end

	def checkCreate
		guild = Guild.new(guildname: params[:guildname], anagram: params[:anagram], owner: params[:owner]);
		if guild.save() == false
				render(:json => {error: 'you cannot create a guild with this name'})
		 else
		 	guild.destroy
		 	render(:json => {error: false})
		 end
	end

	def checkOfficier
		guild = Guild.find_by(id: params[:idguild])
		user = guild.users.find_by(username: params[:username])
		owner = guild.users.find_by(username: params[:sender])
		if !user
			render(:json => {error: 'no user with this name in this guild'})
		else
			if !(guild.owner == params[:sender] || owner.admin)
				render(:json => {error: 'you have no guild right'})
			else
				render(:json => {nothing: 'nothing'})
			end
		end
	end

	def removeOfficer
		guild = Guild.find_by(id: params[:guild_id])
		user = guild.users.find_by(username: params[:target])
		owner = guild.users.find_by(username: params[:owner])
		if !user
			render(:json => {error: 'no user with this name in this guild'})
		else
			if !(guild.owner == params[:owner] || owner.admin)
				render(:json => {error: 'you have no guild right'})
			else
				user.update(officer: false);
				render(:json => {nothing: 'nothing'})
			end
		end
	end

end
