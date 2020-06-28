Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get "/carl" => "root#carl"
  get "/johnson" => "root#johnson"

  get "/main" => "root#index"
  post "/main" => "root#index"
  get "/login" => "root#create"
  get "/" => "root#new"

  get "/user/:id" => "users#index"
  get "/user/friends/:id/add" => "users#new"
  get "/user/friends/:id/remove" => "users#edit"
  get "/user" => "users#show"
  put "/user" => "users#update"
  patch "/user" => "users#update"

  get "/users/:id" => "users#search"
  get "/watch" => "users#watch"
  get "/user/ban/:id" => "users#ban"
  get "/user/unban/:id" => "users#unban"
  patch "/user/update/avatar" => "users#update_avatar"

  get "/tournament/rank/:id" => "tournament#index"
  get "/tournament/match" => "tournament#show"

  get "/deathmatch/index" => "deathmatch#index"
  get "/deathmatch/create" => "deathmatch#create"
  get "/deathmatch/join" => "deathmatch#join"
  get "/deathmatch/challenge" => "deathmatch#challenge"

  # ---- Guild ----

  get "/guilds" => "guilds#index"
  post "/guild" => "guilds#create"
  get "/guild/:id/edit" => "guilds#edit"
  get "/guild" => "guilds#show"
  post "/officer" => "guilds#createOfficer"
  get "/officer" => "guilds#showOfficer"
  get "/removeOfficer" => "guilds#removeOfficer"
  get '/guilds/check' => 'guilds#checkCreate'
  get '/guilds/checkOfficier' => 'guilds#checkOfficier'

   # ---- Guild wars----

   post '/guildwars' => 'guildwars#create'
   get 'guildwars/acceptwar' => 'guildwars#acceptwar'

   post 'guildwars/match' => 'guildwars#match'
   get '/guildwars/acceptmatch' => 'guildwars#acceptmatch'

   get 'guildwars/war' => 'guildwars#show'
   get "/guildswars/history" => 'guildwars#history'



  # ---- Chat ----

  post 'message/chatroom' => 'message#chatroom'

  post 'chatroom/create' => 'roomchat#create'
  post 'roomchat/ban' => 'roomchat#ban'
  post 'roomchat/unban' => 'roomchat#unban'
  post 'roomchat/admin' => 'roomchat#admin'
  post 'roomchat/password' => 'roomchat#password'
  post 'roomchat/unpassword' => 'roomchat#unpassword'
  post 'roomchat/game' => 'roomchat#game'
  get  'roomchat/join' => 'roomchat#join'
  get  'roomchat/index' => 'roomchat#index'
  post 'roomchat/destroy' => 'roomchat#destroy'
  post 'roomchat/unadmin' => 'roomchat#unadmin'

  get  'game/create' => 'game#create'

  post 'personal/mute' => 'personnal#mute'
  post 'personal/unmute' => 'personnal#unmute'
  post 'personal/pm' => 'personnal#pm'
  post 'personal/profile' => 'personnal#profile'
  get  'personal/muted' => 'personnal#muted'

end
