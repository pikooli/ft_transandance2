module ApplicationCable
	class Connection < ActionCable::Connection::Base

		identified_by :current_user

		def connect
			# connection.rb doesn't have access to session
			user = User.find_by(:id => cookies.encrypted[:user_id]);
			if user == nil
				reject_unauthorized_connection;
			else
				self.current_user = user;
			end
		end

	end
end
