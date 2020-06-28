import USER from "./user";
import {Guildwar} from "../Guildwars/guildwars"
import {subscGuild} from '../channels/guild_channel'
import {popWindows,popChoise, pop404} from '../popWindows/popWindows'
import {txt404,cat404} from  '../Useless/funscript'

/* --- chat --- */
import {unsubAll} from '../chat/index'
/* ------------ */
var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

let GUILD = {};

GUILD.Model = Backbone.Model.extend({
	url: function() {
		return "/guild";
	}
});

GUILD.Collection = Backbone.Collection.extend({
	model: GUILD.Model,
	comparator: function(a, b) {
		return (a.get("points") < b.get("points") ? 1 : -1);
	},
	url: function() {
		return "/guilds";
	}
});

GUILD.CollectionWar = Backbone.Collection.extend({
	url: function() {
		return "/guildswars/history";
	}
});


GUILD.model = new GUILD.Model();
GUILD.collection = new GUILD.Collection();
GUILD.collectionWar = new GUILD.CollectionWar();


GUILD.ViewInfo = Backbone.View.extend({
	initialize: function() {
		this.template = _.template(
				"<h2>Your Guild ヽ(´▽`)/</h2>" +
				"<h2 id='guildnameplace'><%- guildname %></h2>" +
				"<h4> Owner : <%- owner %> </h4>" +
				"<input type='text' id='newOfficer' placeholder='username'/>" +
				"<button id='buttonOfficer'>Promote Officier</button>" +
				"<h4> Officier : </h4>" +
				"<ul id='officer'></ul>"
		),
		this.model.on("sync", this.render, this);
		this.model.fetch();
	},
	render: function() {
		if (this.model.get("error") == true) {
			this.$el.html("<h2>you have no guild</h2>");
		}
		else {
			this.$el.html(this.template(this.model.attributes));
		}
	}
});


GUILD.OfficerCollection = Backbone.Collection.extend({
	url: '/officer'
})

GUILD.officerCollection = new GUILD.OfficerCollection();

GUILD.ViewOfficier = Backbone.View.extend({
	collection : GUILD.officerCollection,
	model: GUILD.model,
	initialize: function(){
		this.model.on("sync", this.getOfficer, this)
		this.collection.on('sync', this.render, this)
	},
	events: {
		"click li button" : "removeOfficer",
		"click #buttonOfficer" : "createOfficier",
		"keypress #newOfficer" : 'checkinput'
	},
	checkinput: function(e){
		if (e.which === 13)
			this.createOfficier();
	},
	createOfficier: function(){
		let input = $('#newOfficer')

		if (format.test(input.val()))
			popWindows('incorrect format')

		else if (input.val()){
			$.ajax({
				url: '/guilds/checkOfficier',
				data: {
					username: input.val(),
					idguild: GUILD.model.get('id'),
					sender: $('#playerUsername').html()
				},
				type: "get",

				success: function(data){

					let input = $('#newOfficer')

					if(!data.error){
						GUILD.officerCollection.create(
											{
												username: input.val(),
												idguild: GUILD.model.get('id'),
												sender: $('#playerUsername').html()
											},
											{
												wait: true,
												headers: { "X-CSRF-Token": global.CSRF() }
											}
						);
						popWindows('officier promoted')
					}
					else
						popWindows(data.error)
					input.val('')
				}
			})
		}
	},
	removeOfficer: function(event){
		var target = event.currentTarget.id
		target = target.substring(4,target.size)

		$.ajax({
			url: 'removeOfficer',
			type: 'GET',
			data:{
				owner: $('#playerUsername').html(),
				target: target,
				guild_id: GUILD.model.id,
			},
			success: function(data){
				if (!data.error){
					GUILD.officerCollection.fetch({data: $.param({id: GUILD.model.get('id')})});
				}
				else
					popWindows(data.error)
			}
		})
	},
	getOfficer: function(){
		this.collection.fetch({data: $.param({id: this.model.get('id')})});
	},
	render: function(){

		let elem = $('#officer')
		elem.html('')
		this.collection.each(function(username){

			elem.append('<li> ' + username.get("username") + '<button type="button" id="offi' + username.get("username") +'">X</button></li>')
		})
	}
})


GUILD.ViewCreate = Backbone.View.extend({
	events: {
		"click input[type='button']": "create",
		"keypress input[type='text']": "check"
	},
	check: function(e){
		if (e.which === 13)
			this.create();
	},
	create: function() {
		var input = this.$el.children("input[type='text']");

		if (format.test(input.val()))
			popWindows('incorrect format')
		else if (input.val()){
			$.ajax({
				url: '/guilds/check',
				data: {	guildname: input.val(),
						anagram: input.val().substring(0, 5),
						owner: USER.model.get("username")
				},
				type: "get",
				success: function(data){

					var input = $('#makeGuild');
					if (!data.error){
						GUILD.collection.create({ guildname: input.val(),
											anagram: input.val().substring(0, 5),
											owner: USER.model.get("username")
											},
										{ wait: true,
										headers: { "X-CSRF-Token": global.CSRF() } });
						popWindows('guild create')
					}
					else
						popWindows(data.error)
					input.val("");
				}
			})
		}
	}
});

GUILD.ViewJoin = Backbone.View.extend({
	template: _.template("<li>" +
						  "<%- guildname %> [<%- points %>]" +
						  "<button data-guild=<%- guildname %>>join</button></li>"),
	events: {
		"click button" : "join",
		"dblclick button" : "join"
	},
	initialize: function() {
		this.collection.on("sync", this.render, this);
		this.collection.fetch();
	},
	render: function() {
		this.$("ol").html("");
		this.collection.each(this.renderItem, this);
	},
	renderItem: function(item) {
		this.$("ol").append(this.template(item.attributes));
	},
	join: function(event) {
		let guild = $(event.currentTarget).data("guild")

		this.model.fetch({ url: "/guild/" +
								guild +
								"/edit" });
		$('#anagram').html('[' + guild.substring(0, 5) + ']');
		subscGuild();
	}
});

GUILD.View = Backbone.View.extend({
	el: "#main",
	initialize: function() {
		this.$el.html($("#guildTemplate").html());

		new GUILD.ViewInfo({ el: this.$("#guildInfo"),
							 model: this.model });

		new GUILD.ViewCreate({ el: this.$("#guildCreate"),
							   collection: this.collection });

		new GUILD.ViewJoin({ el: this.$("#guildJoin"),
							 model: this.model,
							 collection: this.collection });
		new GUILD.ViewRanking({el: this.$("#guildRanking"),
								model: this.model,
								collection: this.collection })
		new GUILD.ViewOfficier({el: this.$('#guildInfo')});

		Guildwar(GUILD.model);
	},
	events:{
		"click #MyGuild": "getGuild"
	},
	getGuild: function(){
		GUILD.officerCollection.fetch({data: $.param({id: GUILD.model.get('id')})})
	}
});

//-------------------------------------------------

GUILD.ViewRanking = Backbone.View.extend({
	template: _.template("<li>" +
						  "[<%- guildname %>] points : <%- points %>"
	),
	initialize: function() {
		this.collection.on("sync", this.render, this);
	},
	render: function() {
		this.$("ol").html("");
		this.collection.each(this.renderItem, this);
	},
	renderItem: function(item) {
		this.$("ol").append(this.template(item.attributes));
	},
});
// ------------------------------------------------------------------------ history

GUILD.ViewHistory = Backbone.View.extend({

	collection: GUILD.collectionWar,
	template: _.template(	"<input id='seachHistoy' placeholder='name of the guild'>" +
							"<button id='searchhistory'>search</button>" +
							"<table id='searchresult'>" +
							"</table>"
	),
	templateOne: _.template(	"<tr><th><%- id %></th><th><%- start %></th><th><%- end %></th><th> <%- guildname_1 %> </th> <th><%- point_1 %></th> "+
								"<th><%- guildname_2 %></th> <th><%- point_2 %></th>" +
								"<th><%- pointbet %> </th></tr>"
	),
	initialize: function() {
		this.$el.html(this.template())
		this.collection.on('sync', this.render, this)
	},
	events:
	{
		"click #searchhistory": "searchhistory",
		'keypress #seachHistoy' : 'checkinput'
	},
	checkinput: function(e){
		
		if (e.which === 13)
			this.searchhistory()
	},
	searchhistory: function(){

		if ($('#seachHistoy').val())
			if (format.test($('#seachHistoy').val()))
				popWindows('incorrect format')
			else
				this.collection.fetch({data: $.param({guildname: $('#seachHistoy').val()})})
			$('#seachHistoy').val('')
	},
	render: function(){
		if (!this.collection.length)
			$('#searchresult').html(cat404())
		else{
			$('#searchresult').html("<tr> <th> Match ID</th><th> Start on </th><th> end </th> <th>Guild 1</th><th> Score Guild 1 </th> <th>Guild 2</th><th> Score Guild 2 </th> <th> Point bet</th> </tr> ")
			this.collection.each(this.renderthis, this)
			this.collection.reset()
		}
	},
	renderthis: function(item){
		var  a = item.attributes

		for (let key in a){
			this.renderOne(a[key])
		}
	},
	renderOne: function(item){
		$('#searchresult').append(this.templateOne(item))
	}
});




// ---------------------------------------------------------------------------

GUILD.ViewMyGuild = Backbone.View.extend({
	el: '#GuildMenu',
	events: {
		'click #MyGuild' : 'showMyGuild',
		'click #CreateGuild' : 'showCreateGuild',
		'click #JoinGuild' : 'showJoinGuild',
		'click #GuildRank' : 'showGuildRank',
		'click #ProposeWars' : 'showProposeWars',
		'click #GuildWars' : 'showguildWars',
		'click #GuildHistory' : 'showguildHistory',

	},
	showMyGuild: function(){
		showpartiel('guildInfo');
	},
	showCreateGuild: function(){
		showpartiel('guildCreate');
	},
	showJoinGuild: function(){
		GUILD.collection.fetch()
		showpartiel('guildJoin');
	},
	showGuildRank: function(){
		GUILD.collection.fetch()
		showpartiel('guildRanking');
	},
	showProposeWars: function(){
		showpartiel('proposeWars');
	},
	showguildWars: function(){
		showpartiel('guildWars');
	},
	showguildHistory: function(){
		showpartiel('guildHistory');
		$('#seachHistoy').focus()

	},
})

// ----------------------------------------------------------
function removeOn(element){
	element.unbind()
}

function showpartiel(show){
	$('#GuildMain div').hide();

	$('#' + show).show();
}

GUILD.display = function() {
	window.location.hash = "#guild";

	removeOn(GUILD.model)
	removeOn(GUILD.collection)
	removeOn(GUILD.collectionWar)

	/* --- chat --- */
	unsubAll();
	/* ------------ */
	new GUILD.View({ model: GUILD.model, collection: GUILD.collection });
	new GUILD.ViewMyGuild;
	new GUILD.ViewHistory({	el: '#guildHistory'});
	subscGuild();

}

$("#nav input[value='Guild']").on("click", GUILD.display);

export default GUILD;

