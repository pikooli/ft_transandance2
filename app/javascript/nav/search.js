/* --- chat --- */
import {unsubAll} from '../chat/index'
/* ------------ */
import {popWindows,popChoise, pop404} from '../popWindows/popWindows'


var format = /[ `!@#$%^&*()_+\-=\[\]{};‘:“\\|,.<>\/?~]/;

let SEARCH = {};
let username = "";

SEARCH.matches = new Backbone.Collection();
SEARCH.matches.comparator = "id";
SEARCH.user = new Backbone.Model();

SEARCH.ViewBar = Backbone.View.extend({
	events: {
		"keypress input[type='text']": "search",
	},
	search: function(event) {
		if (event.which == global.ENTER_KEY) {
			username = $(event.currentTarget).val();
			$(event.currentTarget).val("");
			if (username != "" && !format.test(username)) {
				this.collection.fetch({
					url: "/users/" + username,
					reset: true
				});
			}
		}
	}
});

SEARCH.ViewUser = Backbone.View.extend({
	events: {
		"click input[value='ban']": "ban",
		"click input[value='unban']": "unban"
	},
	initialize: function() {
		this.collection.on("sync", this.render, this);
	},
	render: function() {
		console.log(this.collection.length)
			this.$el.attr("class", "show");
			this.$("h3").html(username);
	},
	ban: function() {
		this.model.fetch({ url: "/user/ban/" + this.$("h3").html() });
	},
	unban: function() {
		this.model.fetch({ url: "/user/unban/" + this.$("h3").html() });
	}
});

SEARCH.ViewMatches = Backbone.View.extend({
	template: _.template("<li>" +
						 "<%- matchType %>: <%- playerLeft %> vs <%- playerRight %>" +
						 " [<%- scoreLeft %> - <%- scoreRight %>]" +
						 "</li>"),
	initialize: function() {
		this.collection.on("sync", this.render, this);
	},
	render: function() {
		this.$("ul").html("");
		this.collection.each(this.renderItem, this);
	},
	renderItem: function(item) {
		this.$("ul").append(this.template(item.attributes));

	}
});

SEARCH.View = Backbone.View.extend({
	el: $("#main"),
	initialize: function() {
		this.$el.html($("#searchTemplate").html());

		new SEARCH.ViewBar({ el: this.$("#searchBar"),
							  collection: this.collection });
		new SEARCH.ViewUser({ el: this.$("#searchUser"),
							  model: this.model,
							  collection: this.collection });
		new SEARCH.ViewMatches({ el: this.$("#searchMatches"),
								 collection: this.collection });
	}
});

SEARCH.display = function() {
	window.location.hash = "#search";

	/* --- chat --- */
	unsubAll();
	/* ------------ */

	new SEARCH.View({ model: SEARCH.user, collection: SEARCH.matches });
}

$("#nav input[value='Search']").on("click", SEARCH.display);

export default SEARCH;
