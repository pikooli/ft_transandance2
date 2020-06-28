import USER from "./user";
import {chatFunction} from "../chat/index";

var player;

let CHAT = {};

CHAT.Collection = Backbone.Collection.extend({
	url: function() {
		return "/roomchat/index";
	}
});
CHAT.collection = new CHAT.Collection();

CHAT.ViewRoomchats = Backbone.View.extend({
	template: _.template("<li>" +
						 "<label><%= roomname %></label>" +
						 "<input type='password' id='password<%= roomname %>' placeholder='password'/>" +
						 "<button id='room<%= roomname %>'>join</button>" +
						 "<hr/>" +
						 "</li>"),
	initialize: function() {
		this.collection.on("sync", this.render, this);
		this.collection.fetch();
	},
	render: function() {
		this.$("ul").html("");
		this.collection.each(this.renderItem, this);
	},
	renderItem: function(item) {
		this.$("ul").append(this.template(item.attributes));
	}
});

CHAT.View = Backbone.View.extend({
	el: "#main",
	initialize: function() {
		this.$el.html($("#chatTemplate").html());

		new CHAT.ViewRoomchats({ el: this.$("#chatroom"),
								 collection: this.collection });
	}
});

CHAT.display = function() {
	window.location.hash = "#chat";

	player = USER.model.get("username");

	new CHAT.View({ collection: CHAT.collection });

	chatFunction();
};

$("#nav input[value='Chat']").on("click", CHAT.display);

export default CHAT;
export var player;
