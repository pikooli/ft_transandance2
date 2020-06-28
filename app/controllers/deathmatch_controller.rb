class DeathmatchController < ApplicationController

	#after_action do
	#	puts response.body;
	#end

	def index
		if deathmatch = Deathmatch.last();
			render(:json => deathmatch.users.all());
		else
			render(:json => nil);
		end
	end

	def create
		user = User.find_by(:id => session[:user_id]);
		if user.admin == false || Deathmatch.generate() == nil
			render(:json => { :text => "You cannot create a Deathmatch Tournament" });
		else
			render(:json => { :text => "Deathmatch start in 30 seconds" });
			User.Broadcast_to_all("Deathmatch start in 30 seconds")
		end
	end

	def join
		user = User.find_by(:id => session[:user_id]);
		if Deathmatch.join(user) == nil
			render(:json => { :text => "#{user.userid} has not joined" });
		else
			render(:json => { :text => "#{user.userid} has joined" });
		end
	end

	def challenge
		user = User.find_by(:id => session[:user_id]);
		contestant = Deathmatch.challenge(user);
		if contestant != nil && Matchmaking.make(user, contestant, "deathmatch")
			render(:json => { :text => "Match initiated" });
		else
			render(:json => { :text => "No match available" });
		end
	end




end
