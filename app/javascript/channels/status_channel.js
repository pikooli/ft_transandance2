import consumer from "./consumer"
import USER from "../nav/user";

consumer.subscriptions.create("StatusChannel", {
	connected() {
		USER.model.fetch();
	}
});
