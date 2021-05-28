class Star {
	constructor(x, y) {
		this.position = createVector(x, y + 1000);
		this.velocity = createVector(0, 0);
		this.diameter = random(5, 20);

		this.color = random([
			"#6d99ff",
			"#7069ff",
			"#c76eff",
			"#ff5b76",
			"#ff6868"
		]);

		if (Math.random() < 0.8) this.color = "white";

		this.maxBrightness = 6;
		this.brightness = random(0.1, this.maxBrightness);
	}

	render() {
		let clr = color(this.color).levels;
		noStroke();
		fill(clr[0], clr[1], clr[2], (255 / this.maxBrightness) * this.brightness);
		beginShape();
		circle(this.position.x, this.position.y, this.diameter);
		endShape();

		fill(clr[0] + 20, clr[1], clr[2] + 10, this.brightness / 2);
		beginShape();
		circle(this.position.x, this.position.y, this.diameter * 5);
		endShape();

		fill(clr[0] + 20, clr[1], clr[2] + 10, this.brightness / 4);
		beginShape();
		circle(this.position.x, this.position.y, this.diameter * 10);
		endShape();
	}

	parallax() {
		let depth = 5;
		this.velocity.x = -map(game.camera.velocity.x * this.diameter, 0, 100, 0.1, depth);
		this.velocity.y = -map(game.camera.velocity.y * this.diameter, 0, 100, 0.1, depth);
		this.position.add(this.velocity);
	}
}