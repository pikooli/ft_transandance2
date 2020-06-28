import {popWindows,popChoise} from '../popWindows/popWindows'

var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

let GUILD = {};

GUILD.Wars = Backbone.Model.extend({
	url: function(){return "guildwars/war"}
})

GUILD.wars = new GUILD.Wars()

GUILD.ViewWars = Backbone.View.extend({
	initialize: function() {
		this.template = _.template(	'<h2>Guild Wars （　ﾟДﾟ）</h2>' +
									'<ul>' +
									'<li> All wars last 5 min </li>' + 
									'<li>War time start at the begin of the war ,but it only last for 2 min.</li>'+
									'<li>During war time any menber of your guild can propose a match with the other guild (only one pending propose by guild).</li>'+
									'<li>War Match are proposed to the other guild and can be accepted by any menber of the opposite guild.</li>'+
									'<li>Each Match win again the enemy guild give one point </li>' +
									'<li>If a Match propose is not accepted in 5 sec , it automatically won</li>' +
									'<li>You can choose the number of unanswered match during that war time, if you got to mush unanswered match' +
									'the war time is over</li>' + 
									'<li>You can set the number of point you bet.</li>' +
									'<li>If "add-on" is on, all match win public or tournament give one point to the guild war</li>' +
									'<h3>Winner is the guild with the more war point at the end , winner take all HF</h3> '+
									'<p>Enemy guild				<input type="string" id="opponent" placeholder="enemy guild"/> <p/>' +
									'<p>Point bet					<input type="string" id="pointBet" placeholder="number of point bet"/> <p/>'+
									'<p>Number of unanswered match	<input type="string" id="unansweredMatch" placeholder="number of unanswered match during war time"/> <p/>' +
									'<p><input type="checkbox" id="add-on">add-on, all match count for war point </input><p/>' +
									'<button id="propose-wars">Propose wars</button>'

		);
		this.render();
	},
	render: function() {
		this.$el.html(this.template());
	},
})

GUILD.ViewProposeWars = Backbone.View.extend({
	initialize: function() {
	},
	events: {
		"click #propose-wars": "proposeWars"
	},
	proposeWars: function(){
		var opponent = $('#opponent').val()
		var pointbet = $('#pointBet').val()
		var unanMatch = $('#unansweredMatch').val()
		var addon = $('#add-on').is(':checked')
		
		if (!opponent || !pointbet || !unanMatch || isNaN(pointbet)|| isNaN(unanMatch)|| format.test(opponent))
			popWindows('bad input')
		else if (pointbet > 100 || unanMatch > 100)
			popWindows('number input is to big !! ( that what she said ) limit is 100')
		else
			$.ajax({
				type: "POST",
				url: 'guildwars',
				data: {
					guildname: this.model.get('guildname'),
					opponent: opponent,
					pointbet: pointbet,
					unanMatch: unanMatch,
					addon: addon
				},
				headers: { "X-CSRF-Token": global.CSRF() },
				success: function(data){

					if (data.error)
					 	popWindows(data.content)
					else
						popWindows('Wars Invitation Send')
				}
            })
	},
})

//---------------------------------------------------------------------------------

GUILD.ViewWarsGuild = Backbone.View.extend({
	template: _.template(	'<h1> ----------- GUILD WAR -------- </h1>' +
							'<table><tr><th>⊂(◉‿◉)つ </th><th><%- guildname_1 %> </th><th>VS</th><th><%- guildname_2 %></th><th> ⊂(◉‿◉)つ</th><tr>' +
							'<tr><th/><th><%- point_1 %> </th><th>score</th><th><%- point_2 %></th><th/></tr></talbe>' +
							'<table><tr><th>Start :</th><th> <%- start %></th></tr> '+
							'<tr><th>End : </th><th><%- end %></th></tr>' +
							'<tr><th>Addon : </th><th><%- addon %></th></tr>' +
							'<tr><th>Number of unanwered match autorised : </th><th><%- setunwanswered %></th></tr>' +
							'<tr><th>Point bet :</th><th><%- pointbet %> </th></tr></table>' +
							'<button id="proposeMatch" value="<%- id %>">propose a match</button>'
						),
	model: GUILD.wars,
	initialize: function(){
		GUILD.guild.on('sync', this.getAttribues, this)
		this.model.on('sync', this.render, this)
	},
	getAttribues: function(){
		this.model.fetch({data: $.param({guildname: GUILD.guild.get('guildname')})});
	},
	render: function(){
		this.$el.html('Your guild currently don\'t have any war')
		if(this.model.get('start'))
			this.$el.html(this.template(this.model.attributes))
	},
})

GUILD.ViewWarsMatch = Backbone.View.extend({
	events: {
		'click #proposeMatch' : 'proposematch' 
	},
	proposematch: function(){

		var id = $('#proposeMatch').attr('value')
		var username = $('#playerUsername').html()

		$.ajax({
			type: "POST",
			url: 'guildwars/match',
			data: {
				war_id: id,
				guild_id: GUILD.guild.get('id'),
				challenger: username
			},
			headers: { "X-CSRF-Token": global.CSRF() },
			success: function(data){
				if (data.error)
					 popWindows(data.content)
				// else
				//  	popWindows('Wars Match Send')
			}
		})
	}
})

export function Guildwar(model){

	GUILD.guild = model
	
	$('#GuildWars').on("click", function(){
		GUILD.wars.fetch({data: $.param({guildname: GUILD.guild.get('guildname')})})
	})
	new GUILD.ViewWars({el: $("#proposeWars"), model: model});
	new GUILD.ViewProposeWars({el: $("#proposeWars"), model: model});
	new GUILD.ViewWarsGuild({el: $('#guildWars')})
	new GUILD.ViewWarsMatch({el: $('#guildWars')})

}
