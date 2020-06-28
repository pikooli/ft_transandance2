require("jquery");
require("underscore");
require("backbone");

/* ---- global values ---- */
window.global = {};

global.ENTER_KEY = 13;
global.CSRF = function() {
	return $("meta[name='csrf-token']").attr("content");
}
/* ------------------------ */

require("channels");
require("nav");

import USER from "../nav/user";
import SEARCH from "../nav/search";
import GUILD from "../nav/guild";
import PONG from "../nav/pong";
import WATCH from "../nav/watch";
import TOURNAMENT from "../nav/tournament";
import DEATHMATCH from "../nav/deathmatch";
import CHAT from "../nav/chat";

/* ---- fragment identifiers/hash ---- */
$(window).on("hashchange", function() {
	switch (window.location.hash) {
		case "#user":
			USER.display();
			break;
		case "#search":
			SEARCH.display();
			break;
		case "#guild":
			GUILD.display();
			break;
		case "#pong":
			PONG.display();
			break;
		case "#watch":
			WATCH.display();
			break;
		case "#tournament":
			TOURNAMENT.display();
			break;
		case "#deathmatch":
			DEATHMATCH.display();
			break;
		case "#chat":
			CHAT.display();
	}
});
/* ------------------------ */

/* ---- start ---- */
USER.display();
/* ------------------------ */
