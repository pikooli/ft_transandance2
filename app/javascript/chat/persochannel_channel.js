import consumer from "../channels/consumer"
import {unsub, ismuted} from './index'
import {popWindows, popChoise} from '../popWindows/popWindows'

var subperso;

export function personnalchannel(){

	var player = $('#playerUsername').html()

	if (subperso){
		
		if (subperso.identifier != '{"channel":"PersochannelChannel","speudo":"'+ player + '"}')	 	
		{
			subperso.unsubscribe()
			subscribe(player);
		}
	}
	else
		subscribe(player)
}

function subscribe(player){

	subperso =  consumer.subscriptions.create({channel: "PersochannelChannel", speudo: player}, {

		connected() {},
		disconnected() {},
		received(data) {

			if (data.error)
				popWindows(data.error)

			if (data.ban)
					if ($("#chatname").html() === data.ban){
						Message("pink", " you have been ban, quit the room motherfucker (╬ ಠ益ಠ)s");
						unsub();
					}
			if (data.banned)
					if ($("#chatname").html() === data.banned)
							Message("pink", " you have been ban, quit the room motherfucker (╬ ಠ益ಠ)s");
			if (data.pm)
				if (!ismuted(data.sender))
						popWindows(data.pm)
			if (data.challenger)
				if ($("#chatname").html())
						if (confirm(data.challenger + 'want to play a game with you'))
						{
								$.ajax({
									url: 'game/create',
									data: {
									player1: data.challenger,
									player2: data.opponent
									},
									type: 'GET'
								})
						}
			if (data.joingame){
				popWindows(data.joingame)
			}
		}
	})
}


function Message(color, content){

	var today = new Date();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	let chat = document.getElementById('messagerie')

	chat.innerHTML += "<p style='color:"+ color + ";'>"+ time + " " + content + "</p><hr/>";
	chat.scrollTop = chat.scrollHeight;
}
