class Warmatch < ApplicationRecord
    belongs_to :guildwar
    
    def self.finish(player)
        war = find_war(player.guild_id)
        if !war 
            return
        end
        if player.match == 'warmatch' || war.addon 
            if !war.finish
                if war.guild_1_id == player.guild_id
                    war.point_1 += 1
                else
                    war.point_2 += 1
                end
                war.save
            end
        end
    end

    private

    def self.find_war(guild_id) 
        war = Guildwar.find_by(guild_1_id: guild_id, finish: false)
        if !war 
            war = Guildwar.find_by(guild_2_id: guild_id, finish: false)
            if !war
                return
            end
        end
        return war
    end
end
