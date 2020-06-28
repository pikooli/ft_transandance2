/* --- chat --- */
import {unsubAll} from '../chat/index'
/* ------------ */

let TOURNAMENT = {};

TOURNAMENT.rank1 = new Backbone.Collection();
TOURNAMENT.rank2 = new Backbone.Collection();
TOURNAMENT.rank3 = new Backbone.Collection();
TOURNAMENT.rank4 = new Backbone.Collection();
TOURNAMENT.rank5 = new Backbone.Collection();

TOURNAMENT.ModelMatch = Backbone.Model.extend({
	url: function() {
		return "/tournament/match";
	}
});
TOURNAMENT.match = new TOURNAMENT.ModelMatch();

TOURNAMENT.ViewLadder = Backbone.View.extend({
	template: _.template("<li><%- username %></li>"),
	initialize: function() {
		TOURNAMENT.rank1.on("sync", this.renderRank1, this);
		TOURNAMENT.rank2.on("sync", this.renderRank2, this);
		TOURNAMENT.rank3.on("sync", this.renderRank3, this);
		TOURNAMENT.rank4.on("sync", this.renderRank4, this);
		TOURNAMENT.rank5.on("sync", this.renderRank5, this);

		TOURNAMENT.rank1.fetch({ url: "/tournament/rank/1" });
		TOURNAMENT.rank2.fetch({ url: "/tournament/rank/2" });
		TOURNAMENT.rank3.fetch({ url: "/tournament/rank/3" });
		TOURNAMENT.rank4.fetch({ url: "/tournament/rank/4" });
		TOURNAMENT.rank5.fetch({ url: "/tournament/rank/5" });
	},
	renderRank1: function() {
		let el = this.$("#rank1");
		let array = TOURNAMENT.rank1.pluck("username");
		el.html("");
		for (let index = 0; index < array.length; ++index) {
			el.append(this.template({ username: array[index] }));
		}
	},
	renderRank2: function() {
		let el = this.$("#rank2");
		let array = TOURNAMENT.rank2.pluck("username");
		el.html("");
		for (let index = 0; index < array.length; ++index) {
			el.append(this.template({ username: array[index] }));
		}
	},
	renderRank3: function() {
		let el = this.$("#rank3");
		let array = TOURNAMENT.rank3.pluck("username");
		el.html("");
		for (let index = 0; index < array.length; ++index) {
			el.append(this.template({ username: array[index] }));
		}
	},
	renderRank4: function() {
		let el = this.$("#rank4");
		let array = TOURNAMENT.rank4.pluck("username");
		el.html("");
		for (let index = 0; index < array.length; ++index) {
			el.append(this.template({ username: array[index] }));
		}
	},
	renderRank5: function() {
		let el = this.$("#rank5");
		let array = TOURNAMENT.rank5.pluck("username");
		el.html("");
		for (let index = 0; index < array.length; ++index) {
			el.append(this.template({ username: array[index] }));
		}
	}
});

TOURNAMENT.ViewMatch = Backbone.View.extend({
	events: {
		"click input[value='Play']": "requestMatch"
	},
	template: _.template("<%- text %>"),
	initialize: function() {
		this.model.on("sync", this.render, this);
	},
	render: function() {
		this.$("p").html(this.template(this.model.attributes));
	},
	requestMatch: function() {
		this.model.fetch();
	}
});

TOURNAMENT.View = Backbone.View.extend({
	el: $("#main"),
	initialize: function() {
		this.$el.html($("#tournamentTemplate").html());

		new TOURNAMENT.ViewLadder({ el: this.$("#tournamentRanks") });
		new TOURNAMENT.ViewMatch({ el: this.$("#tournamentMatch"),
								   model: TOURNAMENT.match });
	}
});

TOURNAMENT.display = function() {
	window.location.hash = "#tournament";

	/* --- chat --- */
	unsubAll();
	/* ------------ */

	new TOURNAMENT.View();
}

$("#nav input[value='Tournament']").on("click", TOURNAMENT.display);

export default TOURNAMENT;
