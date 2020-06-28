import consumer from "./consumer"
import {popWindows} from '../popWindows/popWindows'

consumer.subscriptions.create("AlertsChannel", {
	received(data) {
		popWindows(data["text"]);
	}
});
