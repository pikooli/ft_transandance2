import {addmuted, unmute} from './index'
import {popWindows, popChoise, pop404} from '../popWindows/popWindows'

var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;


export function sendMessage(player, token, roomname, anagram){
	var message = $('#Message').val().trim()
	
	if (message) {

		var splitted = message.split(/\s+/);

		if (splitted[0][0] == '\\')
			isspecial(splitted, player, token, roomname, message, anagram)
		else
			$.ajax({
				url: 'message/chatroom',
				data: {
					roomname: roomname,
					speudo: player,
					anagram: anagram,
					content: message,
					authenticity_token: token
				},
				type: "POST"
			})
		$('#Message').val('');
	}
}

function isspecial(splitted, player, token, roomname, message, anagram){

	addtext('pink', message)
	
	for (var i =1; i < splitted.length; i++)
		if (format.test(splitted[i])){
			popWindows('bad input')
			return;
		}
	if (splitted[0] == "\\pm")
		sendPm(splitted, player, token, roomname, anagram)

	if (splitted[0] == "\\mute")
		sendMute(splitted, player, token, roomname)

	if (splitted[0] == "\\unmute")
		sendUnmute(splitted, player, token, roomname)

	if (splitted[0] == "\\game")
		sendGame(splitted,player, token, roomname, anagram)

	if (splitted[0] == "\\profile")
		sendProfile(splitted, player, token, roomname)

	if (splitted[0] == "\\ban")
		sendBan(splitted, player, token, roomname)

	if (splitted[0] == "\\unban")
		sendUnban(splitted, player, token, roomname)

	if (splitted[0] == "\\admin")
		sendAdmin(splitted, player, token, roomname)

	if (splitted[0] == "\\password")
		sendPass(splitted, player, token, roomname)

	if (splitted[0] == "\\unpassword")
		sendUnpass(player, token, roomname)

	if (splitted[0] == "\\destroy")
		sendDestroy(player, token, roomname)
		
	if (splitted[0] == "\\unadmin")
		sendUnadmin(splitted, player, token, roomname)}

function sendGame(splitted, player, token, roomname, anagram) {

	if (!splitted[1])
		popWindows('challenger impossible')
	else
		$.ajax({
			url: 'roomchat/game',
			data: {
				roomname: roomname,
				player: player,
				enemy: splitted[1],
				authenticity_token: token
			},
			type: "POST",
			success: function (data) {
				if (data.content == true)
					addtext('pink', "challenge have been send to " + splitted[1])
				else
					addtext('pink', data.message)
			}
		})
}

function sendUnpass(player, token, roomname) {
	
		$.ajax({
			url: 'roomchat/password',
			data: {
				roomname: roomname,
				owner: player,
				authenticity_token: token
			},
			type: "POST",
			success: function (data) {
				if (data.content == true)
					addtext('pink', "password have been removed ")
				else
					addtext('pink', "you are not the owner of the room")
			}
		})
}

function sendPass(splitted, player, token, roomname) {

	if (!splitted[1])
		popWindows('password impossible')
	else
		$.ajax({
			url: 'roomchat/password',
			data: {
				roomname: roomname,
				owner: player,
				password: splitted[1],
				authenticity_token: token
			},
			type: "POST",
			success: function (data) {
				if (data.content == true)
					addtext('pink', "password have been changed ")
				else
					addtext('pink', "you are not the owner of the room")
			}
		})
}

function sendAdmin(splitted, player, token, roomname){

	if (!splitted[1])
		popWindows('admin impossible')
	else
		$.ajax({
			url: 'roomchat/admin',
			data: {
				roomname: roomname,
				owner: player,
				admin: splitted[1],
				authenticity_token: token
			},
			type: "POST",
			success: function(data){
				if (data.content == true)
						addtext('pink', splitted[1] + " have been promoted to admin")
				else
						addtext('pink', "you are not the owner of the room")
			}
		})
}

function sendUnadmin(splitted, player, token, roomname){

	if (!splitted[1])
		popWindows('unadmin impossible')
	else
		$.ajax({
			url: 'roomchat/unadmin',
			data: {
				roomname: roomname,
				owner: player,
				admin: splitted[1],
				authenticity_token: token
			},
			type: "POST",
			success: function(data){
				if (data.content == true)
						addtext('pink', splitted[1] + " have been remove from the admin")
				else
						addtext('pink', "you are not the owner of the room")
			}
		})
}

function sendMute(splitted, player, token, roomname){

	if (!splitted[1])
		popWindows('mute impossible')
	else
		$.ajax({
			url: 'personal/mute',
			data: {
				roomname: roomname,
				speudo: player,
				mute: splitted[1],
				authenticity_token: token
			},
			type: "POST",
			success: function(data){
				if (data.content == true)
						addtext('pink', splitted[1] + " have been muted")
				addmuted(splitted[1])
			}
		})
}

function sendUnmute(splitted, player, token, roomname){

	if (!splitted[1])
		popWindows('unmute impossible')
	else
		$.ajax({
			url: 'personal/unmute',
			data: {
				roomname: roomname,
				speudo: player,
				unmute: splitted[1],
				authenticity_token: token
			},
			type: "POST",
			success: function(data){
				if (data.content == true)
					addtext('pink', splitted[1] + " have been unmuted")
				else
					addtext('pink', splitted[1] + " was not muted")
				unmute(splitted[1])
			}
		})
}

function sendPm(splitted, player, token, roomname, anagram){
	
	var content = unsplit(splitted)

	if (!splitted[1])
		popWindows('pm impossible')
	else
		$.ajax({
			url: 'personal/pm',
			data: {
				roomname: roomname,
				speudo: player,
				anagram: anagram,
				receive: splitted[1],
				content: content,
				authenticity_token: token
			},
			type: "POST"
		})
}

function sendProfile(splitted, player, token, roomname){

	if (!splitted[1])
		popWindows('mute impossible')
	else
		$.ajax({
			url: 'personal/profile',
			data: {
				roomname: roomname,
				speudo: player,
				profile: splitted[1],
				authenticity_token: token
			},
			type: "POST",
			success: function(data){
				if (data.error){
					pop404()
					addtext("pink", "no user with this name");
				}
				else
					addtext('red', 	"Profile of : " + data.username + " status " + data.status + " "+ 
									"rank : " + data.rank + " guild_id : " + data.guild_id 
					)
			}
		})
}

function sendBan(splitted, player, token, roomname){

	if (!splitted[1])
		popWindows('ban impossible')
	else
		$.ajax({
			url: 'roomchat/ban',
			data: {
				roomname: roomname,
				admin: player,
				banspeudo: splitted[1],
				time: splitted[2],
				authenticity_token: token
			},
			type: "POST"
		})
}

function sendUnban(splitted, player, token, roomname){

	if (!splitted[1])
		popWindows('ban impossible')
	else
		$.ajax({
			url: 'roomchat/unban',
			data: {
				roomname: roomname,
				admin: player,
				banspeudo: splitted[1],
				authenticity_token: token
			},
			type: "POST"
		})
}

function sendDestroy(player, token, roomname){

		$.ajax({
			url: 'roomchat/destroy',
			data: {
				roomname: roomname,
				username: player,
				authenticity_token: token
			},
			type: "POST"
		})
}

function addtext(color, content){
	let chat = document.getElementById('messagerie')
	chat.innerHTML += "<p style='color:"+ color +";'>" +content + "</p><hr/>";
	chat.scrollTop = chat.scrollHeight;
}

function unsplit(splitted){

	var ret= '';
	for(var i=2; i < splitted.length;i++)
		ret += ' ' + splitted[i];
	return ret
}