var PONG = {};

PONG.width = 620;
PONG.height = 620;
PONG.fill = "white";
PONG.backgroundFill = "black";

/* ------------ Table ------------ */
PONG.ViewPaddle = Backbone.View.extend({
	render: function(attributes) {
		this.$el.attr(attributes);
	}
});

PONG.ViewBall = Backbone.View.extend({
	render: function(attributes) {
		this.$el.attr(attributes);
	}
});
/* ------------------------ */

/* ------------ Score ------------ */
PONG.ViewScore = Backbone.View.extend({
	render: function(score) {
		this.$("#scoreLeft").html(score.left);
		this.$("#scoreRight").html(score.right);
	}
});
/* ------------------------ */

/* ------------ PLayers ------------ */
PONG.Collection = Backbone.Collection.extend({
	url: function() {
		return "/user/players";
	}
});

PONG.collection = new PONG.Collection();

PONG.ViewPlayers = Backbone.View.extend({
	count: 0,
	playerLeft: null,
	playerRight: null,
	template: _.template("<li>" +
						 "<label><%- username %> [<%- status %>]</label>" +
						 "</li>"),
	initialize: function() {
		this.collection.on("sync", this.render, this);
		this.collection.fetch();
	},
	render: function() {
		this.count = 0;
		this.$("ul").html("");
		this.collection.each(this.renderItem, this);
	},
	renderItem: function(item) {
		if (this.count == 0) {
			this.count += 1;
			this.playerLeft = item.get("userid");
			this.$("ul").append(this.template(item.attributes));
		}
		else if (this.count == 1) {
			this.count += 1;
			this.playerRight = item.get("userid");
			this.$("ul").append(this.template(item.attributes));
		}
	}
});
/* ------------------------ */

PONG.View = Backbone.View.extend({
	initialize: function() {
		this.$el.html($("#pongTemplate").html());

		PONG.score = new PONG.ViewScore({
			el: this.$("#pongScore")
		});

		this.$("svg").attr({ width: PONG.width, height: PONG.height });
		this.$("svg #background").attr({
			width: "100%",
			height: "100%",
			fill: PONG.backgroundFill
		});
		this.$("svg #net").attr({
			x1: (PONG.width / 2),
			y1: 0,
			x2: (PONG.width / 2),
			y2: PONG.height,
			stroke: PONG.fill
		});
		PONG.leftPaddle = new PONG.ViewPaddle({
			el: this.$("svg #leftPaddle")
		});
		PONG.rightPaddle = new PONG.ViewPaddle({
			el: this.$("svg #rightPaddle")
		});
		PONG.ball = new PONG.ViewBall({
			el: this.$("svg #ball")
		});

		PONG.players = new PONG.ViewPlayers({
			el: this.$("#pongPlayers"),
			collection: PONG.collection
		});
	}
});

PONG.view = null;

export default PONG;
