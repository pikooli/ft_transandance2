/* --- chat --- */
import {unsubAll} from '../chat/index'
/* ------------ */

import consumer from "../channels/consumer"
import PONG from "./pong";

let WATCH = {};

WATCH.channel = consumer.subscriptions.create("WatchChannel", {
	received(data) {
		WATCH.ball.render(data.ball);
		WATCH.leftPaddle.render(data.leftPaddle);
		WATCH.rightPaddle.render(data.rightPaddle);
	}
});

WATCH.CollectionUsers = Backbone.Collection.extend({
	url: function() {
		return "/watch";
	}
});
WATCH.users = new WATCH.CollectionUsers();

WATCH.ViewGames = Backbone.View.extend({
	events: {
		"click input[type='button']": "watch"
	},
	template: _.template("<li>" +
						 "<label><%- username %> [<%- status %>]</label>" +
						 "<input data-name=<%- userid %> type='button'>" +
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
	},
	watch: function(event) {
		let user = $(event.currentTarget).data("name");
		WATCH.channel.perform("follow", { userid: user });
	}
});

WATCH.ViewMatch = Backbone.View.extend({
	render: function(attributes) {
		this.$el.attr(attributes);
	}
});

WATCH.View = Backbone.View.extend({
	el: $("#main"),
	initialize: function() {
		this.$el.html($("#watchTemplate").html());

		new WATCH.ViewGames({
			el: this.$("#watchGames"),
			collection: WATCH.users
		});

		this.$("svg").attr({
			width: PONG.width,
			height: PONG.height
		});
		this.$("svg #watchBackground").attr({
			width: "100%",
			height: "100%",
			fill: PONG.backgroundFill
		});
		this.$("svg #watchNet").attr({
			x1: (PONG.width / 2),
			y1: 0,
			x2: (PONG.width / 2),
			y2: PONG.height,
			stroke: PONG.fill
		});
		WATCH.leftPaddle = new WATCH.ViewMatch({
			el: this.$("svg #watchLeftPaddle")
		});
		WATCH.rightPaddle = new WATCH.ViewMatch({
			el: this.$("svg #watchRightPaddle")
		});
		WATCH.ball = new WATCH.ViewMatch({
			el: this.$("svg #watchBall")
		});
	}
});

WATCH.display = function(event) {
	if ((event && $(event.currentTarget).val() == "Watch")
		|| window.location.hash == "#watch") {
		window.location.hash = "#watch";

		/* --- chat --- */
		unsubAll();
		/* ------------ */

		new WATCH.View();
	}
	else {
		WATCH.channel.perform("unfollow");
	}
}

$("#nav input[type='button']").on("click", WATCH.display);

export default WATCH;
