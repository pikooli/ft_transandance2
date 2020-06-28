class GuildwarJob < ApplicationJob
  queue_as :default

  def perform(anagram1, anagram2, warid)
    war = Guildwar.find_by(id: warid)
    if war 
      GuildChannel.broadcast_to(anagram1, {content: "war finish" })
      GuildChannel.broadcast_to(anagram2, {content: "war finish" })
      war.finish = true;
      guild_1 = Guild.find_by(id: war.guild_1_id)
      guild_2 = Guild.find_by(id: war.guild_2_id)
      if war.point_1 > war.point_2
        guild_1.points += war.pointbet
        guild_2.points -= war.pointbet
      elsif war.point_1 < war.point_2
        guild_2.points += war.pointbet
        guild_1.points -= war.pointbet
      end
      guild_1.save
      guild_2.save
      war.save
    end
  end
end
