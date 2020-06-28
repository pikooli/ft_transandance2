class TournamentController < ApplicationController

	#after_action do
	#	puts response.body;
	#end

	def index
		users = User.where(:rank => params[:id]).select(:username).all();
		render(:json => users);
	end

	def show
		user = User.find_by(:id => session[:user_id]);
		contestant = Tournament.challenge(user);
		if contestant != nil && Matchmaking.make(user, contestant, "ladder")
			render(:json => { :text => "Match initiated" });
		elsif contestant == nil
			render(:json => { :text => "No opponent found !!!!!" });
		else
			render(:json => { :text => "No opponent available !!!!!" });
		end
	end

end
