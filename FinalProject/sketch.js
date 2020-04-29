let canvas;

// Global variable to store the classifier
let classifier;

// Label
let label = "listening...";

// Teachable Machine model URL:
let soundModel = "https://teachablemachine.withgoogle.com/models/4SZuQkymc/";

// convert to alphabetical characters
let morseKey = {
	".-": "A",
	"-...": "B",
	"-.-.": "C",
	"-..": "D",
	".": "E",
	"..-.": "F",
	"--.": "G",
	"....": "H",
	"..": "I",
	".---": "J",
	"-.-": "K",
	".-..": "L",
	"--": "M",
	"-.": "N",
	"---": "O",
	".--.": "P",
	"--.-": "Q",
	".-.": "R",
	"...": "S",
	"-": "T",
	"..-": "U",
	"...-": "V",
	".--": "W",
	"-..-": "X",
	"-.--": "Y",
	"--..": "Z",
	".----": "1",
	"..---": "2",
	"...--": "3",
	"....-": "4",
	".....": "5",
	"-....": "6",
	"--...": "7",
	"---..": "8",
	"----.": "9",
	"-----": "0",
	".-.-.-": ".",
	"--..--": ",",
	"..--..": "?",
	"-..-.": "/",
	".--.-.": "@",
};
let alphaKey = {
	A: ".-",
	B: "-...",
	C: "-.-.",
	D: "-..",
	E: ".",
	F: "..-.",
	G: "--.",
	H: "....",
	I: "..",
	J: ".---",
	K: "-.-",
	L: ".-..",
	M: "--",
	N: "-.",
	O: "---",
	P: ".--.",
	Q: "--.-",
	R: ".-.",
	S: "...",
	T: "-",
	U: "..-",
	V: "...-",
	W: ".--",
	X: "-..-",
	Y: "-.--",
	Z: "--..",
	"1": ".----",
	"2": "..---",
	"3": "...--",
	"4": "....-",
	"5": ".....",
	"6": "-....",
	"7": "--...",
	"8": "---..",
	"9": "----.",
	"0": "-----",
	".": ".-.-.-",
	",": "--..--",
	"?": "..--..",
	"/": "-..-.",
	"@": ".--.-.",
};
let msg = "";
let messageConverted = "";
let spaceCounter = 0;
let words = [];

let scene = "start";
let inputType;

function preload() {
	// Load the model
	classifier = ml5.soundClassifier(soundModel + "model.json");
}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.style("z-index", "-1");
	canvas.position(0, 0);

	fill(255);
	textSize(windowHeight / 30);
	textAlign(CENTER, CENTER);

	// Start classifying
	// The sound model will continuously listen to the microphone
	classifier.classify(gotResult);
}

function draw() {
	switch (scene) {
		case "start":
			startScene();
			break;
		case "morse":
			morseScene();
			break;
	}
}

// The model recognizing a sound will trigger this event
function gotResult(error, results) {
	if (error) {
		console.error(error);
		return;
	}
	// The results are in an array ordered by confidence.
	label = results[0].label;

	// TODO add backspace
	// FIXME be able to control only when voice
	print("Label: " + label);
	switch (label) {
		case "Dot":
			msg += ".";
			break;
		case "Dash":
			msg += "-";
			break;
		case "Space":
			spaceActivated();
			break;
	}
	print("Morse: " + msg);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	if (scene == "start") textSize(windowHeight / 30);
}

function startScene() {
	background(0);

	text("Keyboard", windowWidth / 4, windowHeight / 2);
	text("Voice", (windowWidth / 4) * 3, windowHeight / 2);

	if (mouseIsPressed) {
		scene = "morse";
		textSize(32);

		if (mouseX < windowWidth) inputType = "key";
		else inputType = "voice";
	}
}

function morseScene() {
	background(0);

	words.forEach((word) => {
		rotate(word.rotateDegrees);
		text(word.text, word.x, word.y);
	});
}

function translateMorse(code) {
	return typeof morseKey[code] === "undefined" ? "" : morseKey[code];
}

function convertLetter() {
	let word = {
		text: msg,
		x: random(75, windowWidth - 75),
		y: random(75, windowHeight - 75),
		rotateDegrees: random(360 + 1),
	};
	words.push(word);
	print("Letter pushed: " + msg);

	// translate single character
	messageConverted += translateMorse(msg);
	msg = "";

	print("Word: " + messageConverted);
}

function convertWord() {
	// yeet word onto canvas
	let word = {
		text: messageConverted,
		x: random(75, windowWidth - 75),
		y: random(75, windowHeight - 75),
		rotateDegrees: random(360 + 1),
	};

	let convertToMorse = "";
	Array.from(messageConverted).forEach(
		(element) => (convertToMorse += alphaKey[element])
	);

	word = {
		text: convertToMorse,
		x: random(75, windowWidth - 75),
		y: random(75, windowHeight - 75),
		rotateDegrees: random(360 + 1),
	};

	words.push(word);
	print("Alpha word pushed: " + messageConverted);
	print("Morse word pushed: " + convertToMorse);
	messageConverted = "";
}

function sendHelp() {
	let word = {
		text: "HELP",
		x: random(75, windowWidth - 75),
		y: random(75, windowHeight - 75),
		rotateDegrees: random(360 + 1),
	};
	words.push(word);

	word = {
		text: ".... . .-.. .--.",
		x: random(75, windowWidth - 75),
		y: random(75, windowHeight - 75),
		rotateDegrees: random(360 + 1),
	};
	words.push(word);

	print("Word HELP pushed");
}

function spaceActivated() {
	spaceCounter++;
	print("Spaces: " + spaceCounter);
	if (msg == "") {
		if (spaceCounter == 1) sendHelp();
		else convertWord();

		spaceCounter = 0;
	} else convertLetter();
}

function keyPressed() {
	if (scene == "morse" && inputType == "key") {
		if (keyCode === LEFT_ARROW) msg += ".";
		else if (keyCode === RIGHT_ARROW) msg += "-";
		else if (keyCode === DOWN_ARROW) spaceActivated();
		else if (keyCode == 8) msg = msg.substring(0, msg.length - 1); // backspace, delete

		print("Morse: " + msg);
	}
}
