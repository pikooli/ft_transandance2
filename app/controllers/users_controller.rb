class UsersController < ApplicationController

	#after_action do
	#	puts response.body;
	#end

	def search
		user = User.find_by(:username => params[:id]);
		if user == nil
			render(:json => nil);
		else
			render(:json => user.matches.all());
		end
	end

	def ban
		admin = User.find_by(:id => session[:user_id]);
		user = User.find_by(:username => params[:id]);
		if admin.admin == true && user != nil
			user.update({ :banned => true });
			render(:json => { :text => "Banned" });
		else
			render(:json => { :text => "Action not completed" });
		end
	end

	def unban
		admin = User.find_by(:id => session[:user_id]);
		user = User.find_by(:username => params[:id]);
		if admin.admin == true && user != nil
			user.update({ :banned => false });
			render(:json => { :text => "Unbanned" });
		else
			render(:json => { :text => "Action not completed" });
		end
	end

	def watch
		users = User.select(:userid, :username, :status);
		users = users.where("status like ?", "in a match%").all();
		render(:json => users);
	end

	def update_avatar
		user = User.find_by(:id => session[:user_id]);
		if (params && params[:user] && params[:user][:avatar])
			user.avatar.attach(params[:user][:avatar]);
		end
	end

	# -------------------------------------------------------------------------

	def index
		user = User.find_by(:id => session[:user_id]);
		if params[:id] == "friends"
			render(:json => user.friends.select(:userid, :username, :status).all());
		elsif params[:id] == "players"
			players = User.where(:userid => user.userid);
			players = players.or(User.where(:status => "in a match with #{user.userid}"));
			render(:json => players.select(:userid, :username, :status).all());
		elsif params[:id] == "matches"
			render(:json => user.matches.all());
		else
			render(:plain => "Not found", :status => :not_found);
		end
	end

	def new
		user = User.find_by(:id => session[:user_id]);
		friend = User.find_by(:username => params[:id]);
		if friend == nil
			render(:json => nil);
		else
			if user.friends.find_by(:id => friend.id) == nil
				user.friends<<(friend);
			end
			render(:json => user.friends.select(:userid, :username, :status).all());
		end
	end

	def edit
		user = User.find_by(:id => session[:user_id]);
		friend = User.find_by(:userid => params[:id]);
		user.friends.delete(friend);
		render(:json => user.friends.select(:userid, :username, :status).all());
	end

	def update
		user = User.find_by(:id => session[:user_id]);
		permitted = params.require("user").permit(:username,
												  :status,
												  :TFA?,
												  :admin,
												  :match);
		user.update(permitted);
		render(:json => user.reload());
	end

	def show
		user = User.find_by(:id => session[:user_id]);
		render(:json => user);
	end

end
