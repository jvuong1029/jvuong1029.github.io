var canvas;

// audio
var playing;
var gameAudio, gameOverAudio, jumpAudio, lostLifeAudio, titleAudio;

// scene backgrounds
var screen;
var titleBackground, gameBackground, winBackground, gameOverBackground;

// sprite
var marioSprite;
var marioY, marioJ;
var goombaSprite;
var goombaPassed;

// lives
var livesPic;
var livesLeft;
var livesLeftX1;
var livesLeftX2;
var livesLeftX3;
var livesLeftY;

// game stuff
var score;
var overlap, overlapPrevious;

// fireworks
var fireworks = [];
var gravity;

function preload() {
	// audio
	gameAudio = loadSound("/audio/GameAudio.mp3");
	gameOverAudio = loadSound("/audio/GameOverAudio.mp3");
	jumpAudio = loadSound("/audio/JumpAudio.mp3");
	lostLifeAudio = loadSound("/audio/LostLifeAudio.mp3");
	titleAudio = loadSound("/audio/TitleAudio.mp3");

	// backgrounds
	titleBackground = loadImage("/images/Title.png");
	gameBackground = loadImage("/images/GameBackground.png");
	winBackground = loadImage("/images/Win.png");
	gameOverBackground = loadImage("/images/GameOver.gif");

	// lives
	livesPic = loadImage("/images/MarioHead.png");
}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.style("z-index", "-1");
	canvas.position(0, 0);
	textSize(windowHeight / 30);

	marioSprite = createSprite(100, marioY, 40, 40);
	marioSprite.addAnimation("stand", "/images/MarioCenter.png");
	marioSprite.addAnimation(
		"walk",
		"/images/Mario1.png",
		"/images/Mario3.png"
	);
	marioSprite.addAnimation("jump", "/images/MarioJump.png");
	marioSprite.addAnimation("dead", "/images/MarioDie.png");
	marioY = windowHeight - 220;
	marioJ = 2;

	goombaSprite = createSprite(windowWidth - 110, windowHeight - 120, 40, 40);
	goombaSprite.addAnimation("goomba", "/images/Goomba.png");
	goombaPassed = true;

	livesLeft = 3;
	livesLeftX1 = windowWidth - 90;
	livesLeftX2 = windowWidth - 180;
	livesLeftX3 = windowWidth - 270;
	livesLeftY = 15;

	playing = false;
	screen = "win";

	score = 0;
	overlap = false;
	overlapPrevious = false;

	// fireworks
	colorMode(HSB);
	gravity = createVector(0, 0.2);
	stroke(255);
	strokeWeight(4);
}

function titleScreen() {
	background(titleBackground);
	text(
		"Use left and right arrows to move, and up arrow to jump. Jump over Goombas to get a point. Once you get 7 points then you win. Don't let the Goombas touch you 3 times or you lose. Click or press space bar to start.",
		30,
		30,
		500,
		500
	);
	if (!playing) {
		titleAudio.loop();
		playing = true;
	}

	goombaSprite.visible = false;
}

function preGameScreen() {
	screen = "game";
	titleAudio.stop();
	gameAudio.loop();
	playing = false;
	marioSprite.position.x = 100;
	marioY = windowHeight - 170;
	goombaSprite.velocity.x = goombaVelocity();
}

function gameScreen() {
	background(gameBackground);
	text("Score: ".concat(score), 30, 50);
	goombaSprite.visible = true;
}

function winScreen() {
	background(winBackground);
	goombaSprite.visible = false;
	goombaSprite.velocity.x = 0;
}

function gameOverScreen() {
	background(gameOverBackground);
	if (!playing) {
		gameAudio.stop();
		gameOverAudio.play();
		playing = true;
	}
}

function goombaVelocity() {
	return random(-4, -14); // -13 to -4
}

function lostLife() {
	overlapPrevious = overlap;
	if (!overlapPrevious) {
		lostLifeAudio.play();
		livesLeft--;
	}
	goombaPassed = false;
}

function draw() {
	clear();

	switch (screen) {
		case "title":
			titleScreen();
			break;
		case "game":
			gameScreen();
			break;
		case "win":
			winScreen();
			break;
		case "gameOver":
			gameOverScreen();
			break;
	}

	switch (livesLeft) {
		case 3:
			image(livesPic, livesLeftX3, livesLeftY);
		case 2:
			image(livesPic, livesLeftX2, livesLeftY);
		case 1:
			image(livesPic, livesLeftX1, livesLeftY);
			break;
	}

	drawSprites();
	if (marioSprite.position.y < marioY) marioSprite.position.y += 5;
	if (marioSprite.position.y == marioY) marioJ = 5;
	if (goombaSprite.position.x <= 0) {
		goombaSprite.position.x = windowWidth;
		goombaSprite.velocity.x = goombaVelocity();
		if (goombaPassed) score++;
		goombaPassed = true;
	}

	overlap = marioSprite.overlap(goombaSprite, lostLife);
	if (score >= 7) screen = "win";
	if (livesLeft <= 0) {
		screen = "gameOver";
		marioSprite.changeAnimation("dead");
	}

	// fireworks
	if (screen == "win") {
		colorMode(RGB);
		if (random(1) < 0.03) fireworks.push(new Firework());

		for (var i = fireworks.length - 1; i >= 0; i--) {
			fireworks[i].update();
			fireworks[i].show();

			if (fireworks[i].done()) fireworks.splice(i, 1);
		}
	}
}

function keyPressed() {
	if (screen != "gameOver") {
		if (keyCode === LEFT_ARROW) {
			marioSprite.changeAnimation("walk");
			marioSprite.mirrorX(-1); // flip horizontally
			marioSprite.velocity.x = -4; // move left
		} else if (keyCode === RIGHT_ARROW) {
			marioSprite.changeAnimation("walk");
			marioSprite.mirrorX(1); // flip horizontally
			marioSprite.velocity.x = 4; // move right
		} else if (keyCode === UP_ARROW) {
			marioSprite.changeAnimation("jump");
			jumpAudio.play();
			if (marioJ > 0) {
				marioSprite.position.y -= 150;
				marioJ--;
			}
			marioSprite.velocity.y = -4; // jump up
		} else if (keyCode == 32) {
			// space bar
			if (screen == "title") preGameScreen();
		}
	}
}

function keyReleased() {
	marioSprite.changeAnimation("stand");
	// move left
	if (keyCode === LEFT_ARROW) marioSprite.velocity.x = 0;
	// move right
	else if (keyCode === RIGHT_ARROW) marioSprite.velocity.x = 0;
	// jump up
	else if (keyCode === UP_ARROW) marioSprite.velocity.y = 0;
}

function mouseClicked() {
	if (screen == "title") preGameScreen();
}
