import consumer from "./consumer";

/* --- chat --- */
import {unsubAll} from '../chat/index'
/* ------------ */

import PONG from "../nav/pong";
import GAME from "../nav/game";

GAME.channel = consumer.subscriptions.create("PongChannel", {
	received(data) {
		switch (data.action) {
			case 0:
				if (PONG.view == null) {

					/* --- chat --- */
					unsubAll();
					/* ------------ */

					PONG.view = new PONG.View({ el: $("#main") });
				}

				$('#playerleft').html('[' + data.playerLeft + ']' + ' ');
				$('#playerright').html(' ' + '[' + data.playerRight + ']');

				$("#pongPlay input[value='Start']").off("click");
				$("#pongPlay input[value='Stop']").on("click", PONG.stop);
				$(document).on("keydown", PONG.keydown);
				$(document).on("keyup", PONG.keyup);
				if (data.host == true) {
					GAME.initialize(
						data.playerLeft,
						data.playerRight,
						PONG.width,
						PONG.height,
						PONG.fill
					);
					GAME.loop();
				}
				else {
					GAME.data = {
						playerLeft: data.playerLeft,
						playerRight: data.playerRight,
						direction: 0,
						score: {},
						attributes: {}
					};
				}
				break;
			case 1:
				GAME.game = false;
				break;
			case 2:
				GAME.leftPaddleDirectionY = data.direction;
				break;
			case 3:
				GAME.rightPaddleDirectionY = data.direction;
				break;
			case 4:
				GAME.channel.perform("reset", data);
				break;
			default:
				if (PONG.score){
					PONG.score.render(data.score);
					PONG.ball.render(data.ball);
					PONG.leftPaddle.render(data.leftPaddle);
					PONG.rightPaddle.render(data.rightPaddle);
				}
		}
	}
});

PONG.start = function() {
	if (PONG.players.count == 2) {
		GAME.channel.perform("start", {
			playerLeft: PONG.players.playerLeft,
			playerRight: PONG.players.playerRight
		});
	}
};

PONG.stop = function() {
	GAME.channel.perform("stop", GAME.data);
};

PONG.keydown = function (event) {
	if (event.repeat != true) {
		switch (event.key) {
			case "w":
				GAME.data.direction = -1;
				GAME.channel.perform("direction", GAME.data);
				break;
			case "s":
				GAME.data.direction = 1;
				GAME.channel.perform("direction", GAME.data);
		}
	}
};

PONG.keyup = function (event) {
	switch (event.key) {
		case "w":
		case "s":
			GAME.data.direction = 0;
			GAME.channel.perform("direction", GAME.data);
	}
};

PONG.display = function (event) {
	if ((event && $(event.currentTarget).val() == "Pong")
		|| window.location.hash == "#pong") {
		window.location.hash = "#pong";

		/* --- chat --- */
		unsubAll();
		/* ------------ */

		PONG.view = new PONG.View({ el: $("#main") });

		$("#pongPlay input[value='Start']").on("click", PONG.start);
	}
	else {
		PONG.view = null;

		$(document).off("keydown");
		$(document).off("keyup");
	}
};

$("#nav input[type='button']").on("click", PONG.display);
