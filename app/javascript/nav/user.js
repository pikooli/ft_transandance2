/* --- chat --- */
import {unsubAll} from '../chat/index'
import {personnalchannel} from '../chat/persochannel_channel'
import {subscGuild} from '../channels/guild_channel'

/* ------------ */
var format = /[ `!@#$%^&*()_+\-=\[\]{};‘:“\\|,.<>\/?~]/;

let USER = {}; /* namespace */

USER.Model = Backbone.Model.extend({
	url: function() {
		return "/user";
	}
});
USER.CollectionFriends = Backbone.Collection.extend({
	url: function() {
		return "/user/friends";
	}
});
USER.CollectionMatches = Backbone.Collection.extend({
	comparator: "id",
	url: function() {
		return "/user/matches";
	}
});

USER.model = new USER.Model();
USER.friends = new USER.CollectionFriends();
USER.matches = new USER.CollectionMatches();

USER.ViewAvatar = Backbone.View.extend({
	events: {
		"click input[type='submit']": "reload"
	},
	reload: function() {
		window.location.reload(true);
	}
});

USER.ViewName = Backbone.View.extend({
	events: {
		"dblclick label": "edit",
		"keypress input": "save",
	},
	initialize: function() {
		this.template = _.template(_.unescape(this.$el.html()));
		this.$el.html(this.template(this.model.attributes));
	},
	edit: function(event) {
		$(event.currentTarget).html("Username: ");
		this.$el.children("input").val(this.model.get("username"));
		this.$el.children("input").attr("class", "show");
	},
	save: function(event) {
		if (event.which == global.ENTER_KEY) {
			let username = this.$el.children("input").val();
			if (username != "" && !format.test(username)) {
				this.model.save({ username: username },
								{ patch: true,
								  wait: true,
								  headers: { "X-CSRF-Token": global.CSRF() } });
			}
		}
	}
});

USER.ViewInfo = Backbone.View.extend({
	events: {
		"click #infoAdmin": "admin",
		"click #infoMatch": "match"
	},
	initialize: function() {
		this.template = _.template(_.unescape(this.$el.html()));
		this.$el.html(this.template(this.model.attributes));
	},
	admin: function(event) {
		let value;
		if ($(event.currentTarget).val() == "false")
			value = true;
		else
			value = false;
		this.model.save({ admin: value },
						{ patch: true,
						  wait: true,
						  headers: { "X-CSRF-Token": global.CSRF() } });
	},
	match: function() {
		this.model.save({ match: "none", status: "online" },
						{ patch: true,
						  wait: true,
						  headers: { "X-CSRF-Token": global.CSRF() } });
	}
});

USER.ViewFriends = Backbone.View.extend({
	events: {
		"keypress input[type='text']": "add",
		"click input[type='button']": "remove"
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
	add: function(event) {
		if (event.which == global.ENTER_KEY) {
			let friend = $(event.currentTarget).val();
			$(event.currentTarget).val("");
			this.collection.fetch({ url: "/user/friends/" + friend + "/add" });
		}
	},
	remove: function(event) {
		let friend = $(event.currentTarget).data("name");
		this.collection.fetch({ url: "/user/friends/" + friend + "/remove" });
	}
});

USER.ViewMatches = Backbone.View.extend({
	template: _.template("<li>" +
						 "<%- matchType %>: <%- playerLeft %> vs <%- playerRight %>" +
						 " [<%- scoreLeft %> - <%- scoreRight %>]" +
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

USER.ViewTotp = Backbone.View.extend({
	events: {
		"click input[value='show']": "show",
		"click input[value='hide']": "hide",
		"click input[value='activate']": "activate",
		"click input[value='desactivate']": "desactivate"
	},
	initialize: function() {
		if (this.model.get("TFA?") == true)
			this.$("input[value='TFA?']").val("desactivate");
		else
		this.$("input[value='TFA?']").val("activate");
	},
	show: function(event) {
		$(event.currentTarget).val("hide");
		this.$("label").html(this.model.get("otp_secret"));
		this.$("label").attr("class", "show");
	},
	hide: function(event) {
		$(event.currentTarget).val("show");
		this.$("label").html("");
		this.$("label").attr("class", "hide");
	},
	activate: function(event) {
		$(event.currentTarget).val("desactivate");
		this.model.save({ "TFA?": true },
						{ patch: true, wait: true,
						  headers: { "X-CSRF-Token": global.CSRF() } });
	},
	desactivate: function(event) {
		$(event.currentTarget).val("activate");
		this.model.save({ "TFA?": false },
						{ patch: true, wait: true,
						  headers: { "X-CSRF-Token": global.CSRF() } });
	}
});

USER.View = Backbone.View.extend({
	el: "#main",
	initialize: function() {
		USER.model.on("sync", this.render, this);
		USER.model.fetch();
	},
	render: function() {
		this.$el.html($("#userTemplate").html());

		new USER.ViewAvatar({ el: this.$("#userAvatar"),
							  model: USER.model });

		new USER.ViewName({ el: this.$("#userName"),
							model: USER.model });

		new USER.ViewInfo({ el: this.$("#userInfo"),
							model: USER.model });

		new USER.ViewFriends({ el: this.$("#userFriends"),
							   collection: USER.friends });

		new USER.ViewMatches({ el: this.$("#userMatches"),
							   collection: USER.matches });

		new USER.ViewTotp({ el: this.$("#userTotp"),
							model: USER.model });

		if(USER.model.get('guild_id') && USER.model.get('G_anagram'))
		{
			$('#anagram').html('[' +USER.model.get('G_anagram') + ']');
		}
		$('#playerUsername').html(USER.model.get('username'));
		personnalchannel()
		subscGuild()

	}
});

USER.display = function() {
	window.location.hash = "#user";

	/* --- chat --- */
	unsubAll();
	USER.model.unbind() // i have add this to remove the multiple 'on' on the model user , don't know if it will cause problem to you
						// remove it if it make probleme
	/* ------------ */

	new USER.View();
};

$("#nav input[value='User']").on("click", USER.display);

export default USER;
