class RootController < ApplicationController

	def carl
		@user = User.find_by(:userid => "0") ||
				User.create({ :userid => "0", :username => "carl" });
		session[:user_id] = @user.id;
		session[:guild_id] = @user.guild_id;
		cookies.encrypted[:user_id] = @user.id;

		render("index");
	end

	def johnson
		@user = User.find_by(:userid => "1") ||
				User.create({ :userid => "1", :username => "johnson" });
		session[:user_id] = @user.id;
		session[:guild_id] = @user.guild_id;
		cookies.encrypted[:user_id] = @user.id;

		render("index");
	end

	# -------------------------------------------------------------------------

	def index
		@user = session[:user_id] && User.find_by(:id => session[:user_id]);

		if @user == nil || @user.banned == true
			redirect_to(:action => :new);
		elsif (session[:otp] == true)
			totp = ROTP::TOTP.new(@user.otp_secret)
			if (totp.verify(params[:otp]) == nil)
				redirect_to(:action => :new);
			else
				session[:otp] = false;
			end
		end

	end

	def create
		oauth = Rails.cache.read("oauth#{session.id}");

		endpoint = "https://api.intra.42.fr/oauth/token";
		if oauth == nil || oauth.token(endpoint, params[:code], params[:state]) == nil
			redirect_to(:action => :new);
		else
			endpoint = "https://api.intra.42.fr/oauth/token/info";
			key = "resource_owner_id";
			id = oauth.authenticated_request(endpoint, key);

			user = User.find_by(:userid => id) ||
				   User.create({ :userid => id,
								 :username => id,
								 :otp_secret => ROTP::Base32.random,
								 :TFA? => false });

			session[:user_id] = user.id;
			session[:guild_id] = user.guild_id;

			cookies.encrypted[:user_id] = user.id; # for connection.rb

			if user.TFA? == false
				session[:otp] = false;
				redirect_to(:action => :index);
			else
				session[:otp] = true;
			end
		end

	end

	def new
		session.delete(:user_id);
		session.delete(:guild_id);
		session.delete(:otp);

		cookies.delete(:user_id);

		endpoint = "https://api.intra.42.fr/oauth/authorize";
		if Rails.env.production?
			redirect_uri = "http://172.104.235.110:3000/login";
		else
			redirect_uri = "http://localhost:3000/login";
		end

		oauth = Oauth2.new();
		@login_link = oauth.authorization(endpoint, redirect_uri);
		Rails.cache.write("oauth#{session.id}", oauth);
	end

end
