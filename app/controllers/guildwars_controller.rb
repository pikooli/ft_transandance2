class GuildwarsController < ApplicationController
    def create
        if params[:guildname] == params[:opponent]
            render :json =>{:error => true, :content => "Cannot declare war to yourself"}
            return 
        end
        guild = Guild.find_by(guildname: params[:opponent])
        if !guild
            render :json =>{:error => true, :content => "No guild with this name"}
            return 
        end
        if war = find_war_id(guild.id) 
            render :json =>{:error => true, :content => "Guild already in war"}
        else 
            GuildChannel.broadcast_to(guild.anagram, params)
            render :json =>{:error => false}
        end
    end

    def acceptwar
        guild1 = Guild.find_by(guildname: params[:guildname])
        guild2 = Guild.find_by(guildname: params[:opponent])
        if checkIfInWar(guild1.id, guild2.id)
            GuildChannel.broadcast_to(guild2.anagram, {content: "Already in a warmatch"})
            return
        end
        guildwar = Guildwar.new
        guildwar.guild_1_id = guild1.id
        guildwar.guildname_1 = guild1.guildname
        guildwar.guildanagram_1 = guild1.anagram
        guildwar.guild_2_id = guild2.id
        guildwar.guildname_2 = guild2.guildname
        guildwar.guildanagram_2 = guild2.anagram
        guildwar.addon = params[:addon] == 'true' ? true : false
        guildwar.guild_1_accept = true
        guildwar.guild_2_accept = true
        guildwar.setunwanswered = params[:unanMatch]
        guildwar.start = Time.now 
        guildwar.end = Time.at(guildwar.start.to_i + (5 * 60))
        guildwar.pointbet = params[:pointbet]
        guildwar.save;
        GuildwarJob.set(wait: 5.minutes).perform_later(guild1.anagram, guild2.anagram, guildwar.id)
    end

    def show
        guild = Guild.find_by(guildname: params[:guildname])        
        if guild
            war = find_war_id(guild.id)
            if war
                render :json => war    
                return
            end
        end
        render :json => {:start => ""}
    end

    def match
        war = Guildwar.find_by(id: params[:war_id])
        if !war 
            render :json => {:error => true, :content => 'The war is over'}
            return
        end
        match = war.warmatchs.first
        if ((Time.now.to_i - war.start.to_i) >=  120) && war.wartime
            war.wartime = false
            war.save
        end
        if match || !war.wartime 
            CannotWarChallengeMessage(war)
            return
        end
        SendChallenge(war, params)
        war.warmatchs.create(challenger: params[:challenger], guild_id: params[:guild_id])
        WarmatchJob.set(wait: 10.seconds).perform_later(war.id)
        render :json => {:error => false}
    end

    def acceptmatch
        war = Warmatch.find_by(challenger: params[:challenger])
        if !war 
            war = Warmatch.find_by(challenger: params[:opponent])
        end
        if war 
            war.destroy
        end
        first = User.find_by(username: params[:challenger])
        second = User.find_by(username: params[:opponent])
        if (!Matchmaking.make(first, second, "warmatch"))
            PersochannelChannel.broadcast_to params[:challenger],
                                            {error: "Couldn't do the match"}
            PersochannelChannel.broadcast_to params[:opponent],
                                                {error: "Couldn't do the match"}
        end
    end

    def history
        guild = Guild.find_by(guildname: params[:guildname])
        if !guild
            return
        end
        war1 = Guildwar.where(guild_1_id: guild.id)
        war2 = Guildwar.where(guild_2_id: guild.id)
        hash = returnhash(war1, war2)
        render(:json => hash);
    end  

    private

    def returnhash(war1, war2)
        hash = {}
        i = 0
        war1.each do |t|
            hash.store(i, t.attributes)
            i+=1
        end
        war2.each do |t|
            hash.store(i, t.attributes)
            i+=1
        end
        return hash
    end


    def SendChallenge(war, params)
        if war.guild_1_id == params[:guild_id].to_i
            GuildChannel.broadcast_to(war.guildanagram_2, {war: "guild " + war.guildname_2 + " propose a War Match", data: war, challenger: params[:challenger]})
        else
            GuildChannel.broadcast_to(war.guildanagram_1, {war: "guild " + war.guildname_1 + " propose a War Match",  data: war, challenger: params[:challenger]})
        end
    end

    def CannotWarChallengeMessage(war)
        if !war.wartime 
            render :json => {:error => true, :content => 'War time is over'}
        else
            render :json => {:error => true, :content => 'Your guild have already send a war match'}
        end
    end

    def find_war_id(guild_id)
        war = Guildwar.where(guild_1_id: guild_id, finish: false)
        if !war.first
            war = Guildwar.where(guild_2_id: guild_id, finish: false)      
        end
        return war.first
    end

    def checkIfInWar(guild_1_id, guild_2_id)
        war_1 = find_war_id(guild_1_id)
        war_2 = find_war_id(guild_2_id)
        return war_1 || war_2
    end

end
