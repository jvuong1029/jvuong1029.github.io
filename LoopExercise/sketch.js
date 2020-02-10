function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	let rando1 = random(0, 256);
	let rando2 = random(0, 256);
	let rando3 = random(0, 256);
	background(rando1, rando2, rando3);

	for (let i = 0; i < random(0, 256); i++) {
		stroke(random(0, 256));
		strokeWeight(random(1, 11));
		let x1 = random(0, windowWidth);
		let y1 = random(0, windowHeight);
		let x2 = random(0, windowWidth);
		let y2 = random(0, windowHeight);
		line(x1, y1, x2, y2);
	}

	for (let i = 0; i < random(0, 256); i++) {
		stroke(random(0, 256));
		strokeWeight(random(1, 11));
		let x = random(0, windowWidth);
		let y = random(0, windowHeight);
		let dTemp = windowWidth < windowHeight ? windowWidth : windowHeight;
		let d = random(0, dTemp);
		noFill();
		circle(x, y, d);
	}
}

function mouseClicked() {
	stroke(random(0, 256));
	strokeWeight(random(1, 11));
	rect(mouseX, mouseY, 55, 55);
}
