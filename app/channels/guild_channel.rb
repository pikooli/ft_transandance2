class GuildChannel < ApplicationCable::Channel
  def subscribed
    stream_for params[:guildanagram]
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
