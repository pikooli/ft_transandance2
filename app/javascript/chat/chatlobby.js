import consumer from "../channels/consumer"
import {ismuted,unsubchat} from './index'
import {popWindows,popChoise, popChoise2} from '../popWindows/popWindows'

export function subscribe_to(room, player){

	return  consumer.subscriptions.create({channel: "RoomchatChannel", room: room , speudo: player},{
			connected() {
				connectChat(room);
			},
			disconnected() {},
			rejected() {
				popWindows("you are ban from this chat motherfucker (╬ ಠ益ಠ)s")
			},
			received(data) {
				receiveChat(data);
			}
	});
}

export function connectChat(roomname){

	$('#messagerie').html(welcomeMessage());
	$('#chatname').html(roomname)
	$('#chat').show();
	$('#listusername').show();
	$('#Message').focus();
}

export function receiveChat(data){

			var today = new Date();
			var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			var chat = document.getElementById('messagerie')

			if (data.listuser)
				ft_refreshlistuser(data.listuser);
			else{
				if (data.name){
					if (ismuted(data.name))
						return
					$('#messagerie').append(time + ' ' + data.anagram + data.name + " : " + data.content + "<hr/>");
				}
				if (data.notive)
					chat.innerHTML += "<p style='color:pink;'>" + time + ' ' + data.notive + "</p><hr/>";
				if (data.destroy)
				{
						chat.innerHTML += "<p style='color:pink;'>" + time + ' ' + data.destroy + "</p><hr/>";
						unsubchat();
				}
				chat.scrollTop = chat.scrollHeight;
			}

}

function ft_refreshlistuser(list){
	$('#list').html('');
	for (let key in list){
		$('#list').append('<p>' + list[key].username + '</p>');
	}
}

function welcomeMessage(){

	return '<p style="color:green; font-family:arial, sans-serif;">Welcome to the chat<br/>\
			\\pm "speudo" to pm someone <br/>\
			\\mute "speudo" to mute someone <br/>\
			\\unmute "speudo" to unmute someone <br/>\
			\\game "speudo" to challenge someone <br/>\
			\\profile "speudo" to see the profile <br/>\
			\\ban "speudo" to ban someone from this channel (need admin right)<br/>\
			\\ban "speudo" "time" to ban someone for a certain time (need admin right)<br/>\
			\\unban "speudo" to unban someone (need admin right)<br/>\
			\\admin "speudo" to give admin right (need owner right)<br/>\
			\\password "newpassword" to change the password of the chat (need owner right)<br/>\
			\\unpassword to remove password (need owner right)</p>';

}
