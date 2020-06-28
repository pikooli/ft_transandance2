let GAME = {};
import { popWindows } from '../popWindows/popWindows';

GAME.initialize = function(playerLeft, playerRight, width, height, fill) {
	GAME.game = true;

	GAME.playerLeft = playerLeft;
	GAME.playerRight = playerRight;
	GAME.data = {
		playerLeft: GAME.playerLeft,
		playerRight: GAME.playerRight,
		direction: 0,
		score: {},
		attributes: {}
	};

	GAME.scoreLeft = 0;
	GAME.scoreRight = 0;

	GAME.width = width;
	GAME.height = height;
	GAME.fill = fill;

	GAME.speed = 5;

	GAME.ballWidth = 15;
	GAME.ballHeight = 15;
	GAME.ballX = (GAME.width / 2) - (GAME.ballWidth / 2);
	GAME.ballY = (GAME.height / 2) - (GAME.ballHeight / 2);
	GAME.ballDirectionX = -1;
	GAME.ballDirectionY = Math.random();

	GAME.paddleWidth = 30;
	GAME.paddleHeight = 120;
	GAME.paddleOffset = 20;

	GAME.leftPaddleX = GAME.paddleOffset;
	GAME.leftPaddleY = (GAME.height / 2) - (GAME.paddleHeight / 2);
	GAME.leftPaddleDirectionY = 0;

	GAME.rightPaddleX = GAME.width - GAME.paddleWidth - GAME.paddleOffset;
	GAME.rightPaddleY = (GAME.height / 2) - (GAME.paddleHeight / 2);
	GAME.rightPaddleDirectionY = 0;

	GAME.paddleMinY = 0;
	GAME.paddleMaxY = GAME.height - GAME.paddleHeight;
	GAME.ballMinPaddleX = GAME.leftPaddleX + GAME.paddleWidth;
	GAME.ballMaxPaddleX = GAME.rightPaddleX - GAME.ballWidth;
};

GAME.terminate = function() {
	GAME.data.score = {
		left: GAME.scoreLeft,
		right: GAME.scoreRight
	};
	GAME.channel.perform("score", GAME.data);
};

GAME.reset = function() {
	GAME.ballX = (GAME.width / 2) - (GAME.ballWidth / 2);
	GAME.ballY = (GAME.height / 2) - (GAME.ballHeight / 2);
	GAME.ballDirectionX *= -1;
	GAME.ballDirectionY = Math.random();
	GAME.leftPaddleY = (GAME.height / 2) - (GAME.paddleHeight / 2);
	GAME.rightPaddleY = (GAME.height / 2) - (GAME.paddleHeight / 2);
	GAME.leftPaddleDirectionY = 0;
	GAME.rightPaddleDirectionY = 0;
};

GAME.broadcast = function() {
	GAME.data.attributes = {
		score: {
			left: GAME.scoreLeft,
			right: GAME.scoreRight
		},
		ball: {
			width: GAME.ballWidth,
			height: GAME.ballHeight,
			x: GAME.ballX,
			y: GAME.ballY,
			fill: GAME.fill
		},
		leftPaddle: {
			width: GAME.paddleWidth,
			height: GAME.paddleHeight,
			x: GAME.leftPaddleX,
			y: GAME.leftPaddleY,
			fill: GAME.fill
		},
		rightPaddle: {
			width: GAME.paddleWidth,
			height: GAME.paddleHeight,
			x: GAME.rightPaddleX,
			y: GAME.rightPaddleY,
			fill: GAME.fill
		}
	};
	GAME.channel.perform("broadcast", GAME.data);
};

GAME.leftPaddle_update = function() {
	GAME.leftPaddleY += GAME.speed * GAME.leftPaddleDirectionY;
	if (GAME.leftPaddleY < GAME.paddleMinY) {
		GAME.leftPaddleY = 0;
	}
	else if (GAME.leftPaddleY > GAME.paddleMaxY) {
		GAME.leftPaddleY = GAME.paddleMaxY
	}
};

GAME.rightPaddle_update = function() {
	GAME.rightPaddleY += GAME.speed * GAME.rightPaddleDirectionY;
	if (GAME.rightPaddleY < GAME.paddleMinY) {
		GAME.rightPaddleY = 0;
	}
	else if (GAME.rightPaddleY > GAME.paddleMaxY) {
		GAME.rightPaddleY = GAME.paddleMaxY;
	}
};

GAME.ball_update = function() {
	let ballX = GAME.ballX + GAME.speed * GAME.ballDirectionX;
	let ballY = GAME.ballY + GAME.speed * GAME.ballDirectionY;

	if (ballX < GAME.ballMinPaddleX) {
		if (ballY >= GAME.leftPaddleY &&
			ballY <= (GAME.leftPaddleY + GAME.paddleHeight)) {
				GAME.ballDirectionX *= -1;
		}
		else {
			GAME.scoreRight += 1;
			GAME.reset();
		}
	}
	else if (ballX > GAME.ballMaxPaddleX) {
		if (ballY >= GAME.rightPaddleY &&
			ballY <= (GAME.rightPaddleY + GAME.paddleHeight)) {
			GAME.ballDirectionX *= -1;
		}
		else {
			GAME.scoreLeft += 1;
			GAME.reset();
		}
	}

	if (ballY < 0 || ballY > GAME.height) {
		GAME.ballDirectionY *= -1;
	}

	GAME.ballX += GAME.speed * GAME.ballDirectionX;
	GAME.ballY += GAME.speed * GAME.ballDirectionY;
};

GAME.score_update = function() {
	if (GAME.scoreLeft == 5 || GAME.scoreRight == 5)
		GAME.game = false;
}

GAME.loop = function() {
	if (GAME.game) {
		GAME.broadcast();
		GAME.leftPaddle_update();
		GAME.rightPaddle_update();
		GAME.ball_update();
		GAME.score_update();
		window.requestAnimationFrame(GAME.loop);
	}
	else {
		GAME.terminate();
	}
};

export default GAME;
