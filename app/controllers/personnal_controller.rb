class PersonnalController < ApplicationController
	def mute
		user = User.includes('mutes').find_by(speudo: params[:speudo])
		if find_in_list(user.mutes, params[:mute])
			render :json =>{:content => true}
			return
		end
		user.mutes.create(speudo: params[:mute])
		render :json =>{:content => true}
	end

	def muted
		user = User.includes('mutes').find_by(speudo: params[:speudo])
		if !user
			return;
		end
		muted = user.mutes
		render :json => muted.to_json
	end

	def unmute
		user = User.includes('mutes').find_by(username: params[:speudo])
		if (mute = find_in_list(user.mutes, params[:unmute]))
			mute.destroy
			render :json =>{:content => true}
			return
		end
		render :json =>{:content => false}
	end

	def pm
		if params[:content]
			sendpersonnal(params[:receive], {pm: params[:speudo] + ' : '+ params[:content], sender: params[:speudo], anagram: params[:anagram]})
		end
	end

	def profile
		profile = User.find_by(username: params[:profile])
		if profile
			render :json => profile.to_json
		else
			render :json => {error: true}
		end
	end

	# ------------------------------------------------------------------------------------
	private

	def find_in_list(list, speudo)
		list.each do |t|
			if t.speudo == speudo
				return t
			end
		end
		return false
	end

	def sendpersonnal(speudo, content)
		PersochannelChannel.broadcast_to speudo,
									content
	end
end
