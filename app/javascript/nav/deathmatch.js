/* --- chat --- */
import {unsubAll} from '../chat/index'
import { popWindows } from '../popWindows/popWindows';
/* ------------ */

let DEATHMATCH = {};

DEATHMATCH.ModelCreate = Backbone.Model.extend({
	url: function() {
		return "/deathmatch/create";
	}
});
DEATHMATCH.ModelJoin = Backbone.Model.extend({
	url: function() {
		return "/deathmatch/join";
	}
});
DEATHMATCH.ModelChallenge = Backbone.Model.extend({
	url: function() {
		return "/deathmatch/challenge";
	}
});
DEATHMATCH.create = new DEATHMATCH.ModelCreate();
DEATHMATCH.join = new DEATHMATCH.ModelJoin();
DEATHMATCH.challenge = new DEATHMATCH.ModelChallenge();

DEATHMATCH.CollectionUsers = Backbone.Collection.extend({
	url: function() {
		return "/deathmatch/index";
	}
});
DEATHMATCH.users = new DEATHMATCH.CollectionUsers();

DEATHMATCH.ViewButton = Backbone.View.extend({
	events: {
		"click input[type='button']": "button"
	},
	template: _.template("<%- text %>"),
	initialize: function() {
		this.model.on("sync", this.render, this);
	},
	render: function() {
		this.$("p").html(this.template(this.model.attributes));
		popWindows(this.template(this.model.attributes))
	},
	button: function() {
		this.model.fetch();
	}
});

DEATHMATCH.ViewUsers = Backbone.View.extend({
	template: _.template("<li><%- username %></li>"),
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

DEATHMATCH.View = Backbone.View.extend({
	el: $("#main"),
	initialize: function() {
		this.$el.html($("#deathmatchTemplate").html());

		new DEATHMATCH.ViewButton({
			el: this.$("#deathmatchCreate"),
			model: DEATHMATCH.create
		});

		new DEATHMATCH.ViewButton({
			el: this.$("#deathmatchJoin"),
			model: DEATHMATCH.join
		});

		new DEATHMATCH.ViewButton({
			el: this.$("#deathmatchPlay"),
			model: DEATHMATCH.challenge
		});

		new DEATHMATCH.ViewUsers({
			el: this.$("#deathmatchUsers"),
			collection: DEATHMATCH.users
		});
	}
});

DEATHMATCH.display = function() {
	window.location.hash = "#deathmatch";

	/* --- chat --- */
	unsubAll();
	/* ------------ */

	new DEATHMATCH.View();
}

$("#nav input[value='Deathmatch']").on("click", DEATHMATCH.display);

export default DEATHMATCH;
