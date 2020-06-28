import {personnalchannel} from './persochannel_channel'
import {subscribeChatLobby} from './roomlobby_channel'
import {subscribe_to} from './chatlobby'
import {sendMessage} from './sendMessage'
import {popWindows,popChoise, popChoise2} from '../popWindows/popWindows'

import {player} from '../nav/chat'
var muted = {};

var token;
var subchat;
var sublobby;
var roomname;
var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

export function chatFunction(){
	
	var anagram = $('#anagram').html();

	token = document.getElementsByName('csrf-token')[0].content;
	checkrefresh()
	unsubAll();

	if (!sublobby)
		sublobby = subscribeChatLobby();
	getmuted();
	$("#chatroom").on('click',"button", function(){
		let chatroom = this.id
		chatroom = chatroom.substring(4);

		if ($('#chatname').html() != chatroom ){
			subscribeToRoom(chatroom , player);
		}
	})

	$('#submitNameChat').click(function(){createChatroom()})

	$('#submitMessage').click(function() {sendMessage(player, token, roomname, anagram)})

	$('input').on('keydown', function(data){

		if (data.keyCode === 13){
			if (this.id === 'password')
				$('#submitNameChat').trigger('click')
			else
				$('#submit' + this.id ).trigger('click')
		}
	});

};


function subscribeToRoom(room){

// send a ajax to see if we are ban from this channel or not

	var pass = $('#password'+ room)
	$.ajax({
		url: 'roomchat/join',
		data: {
			roomname: room,
			speudo: player,
			password: pass.val(),
			authenticity_token: token
			},
		type: 'GET',
		success: function(data){
				if (data.erros)
				popWindows('you are ban from this room')
				else if (data.password)
				popWindows('bad password')
				else
				{
					if (subchat)
						subchat.unsubscribe();
					subchat = subscribe_to(data.room, player)
					roomname = data.room;
				}
				pass.val('')
		}
	})
}

function getmuted(){
	$.ajax({
		url: 'personal/muted',
		data: {speudo: player},
		type: 'GET',
		success: function(data){
			jQuery.each(data,function(k,v){
				muted[v.speudo] = true;
			})
		}
	})
}

export function unsubchat(){
	if (subchat)
		subchat.unsubscribe();
}

export function unsubAll(){
	unsubchat();
}

export function addmuted(speudo){
	muted[speudo] = true;
}

export function unmute(speudo){
	muted[speudo] = false;
}

export function ismuted(speudo){
	if (muted[speudo] === true)
		return true
	else
		return false
}

export function unsub(){
	subchat.unsubscribe();
	subchat = null;
}

function createChatroom(){

	var pass =  $('#password').val();
	var content = $('#NameChat').val()

	if (content) {
		if (!format.test(content) && !format.test(pass)){
			sendAjax('chatroom/create',
				{
					speudo: player,
					password: pass,
					roomname: content,
					authenticity_token: token
				}
				, "POST");
		$('#NameChat').val('');
		if (pass)
			$('#password').val('')
		}
		else
		popWindows("bad caractere in namechat or password")
	}
}

function sendAjax(urlSend, dataSend, typeSend='GET'){
	$.ajax({
		url: urlSend,
		data: dataSend,
		type: typeSend
	})

}

function checkrefresh(){

		if (performance.navigation.type == 1) {
			unsubAll()
		} else {
		}
}

