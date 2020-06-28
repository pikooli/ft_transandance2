class WarmatchJob < ApplicationJob
  queue_as :default

  def perform(war_id)
    war = Guildwar.find_by(id: war_id)
    if war
      if !war.finish
        match = war.warmatchs.first
        if match
          if war.guild_1_id == match.guild_id
            war.point_1 += 1
          else
            war.point_2 += 1
          end
          war.unanswered += 1
          if war.unanswered >= war.setunwanswered && war.wartime
            war.wartime = false
          end
          war.save
          match.destroy
        end
      end
    end
  end
end
