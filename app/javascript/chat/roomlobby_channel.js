import consumer from "../channels/consumer"
import CHAT from "../nav/chat"


export function subscribeChatLobby(){

	return consumer.subscriptions.create("RoomlobbyChannel", {
		connected() {
		},
		disconnected() { },
		received(data) {
			CHAT.collection.fetch();
		}
	  });
}
