class Particle {
	constructor(position, angle) {
		this.position = createVector(position.x, position.y);
		let rand = random(0.1, -0.1);
		this.velocity = createVector(cos(angle + rand), sin(angle + rand));
		this.velocity.mult(20);
		this.diameter = 5;
		this.maxDiameter = random(300, 500);
		this.opacity = 100;
		this.color = color(random([
			"#e8f4ff",
			"#ffe3ec",
			"#ffd0df",
			"#ffbdd2",
			"#fff"
		])).levels;

		this.bx = random(-0.5, 0.5);
	}

	render() {
		noStroke();
		fill(this.color[0], this.color[1], this.color[2], this.opacity);
		beginShape();
		circle(this.position.x, this.position.y, this.diameter);
		endShape();
		//image(smoke, this.position.x, this.position.y);
	}

	update() {
		this.position.add(this.velocity);
		this.velocity.mult(0.995)
		this.diameter = lerp(this.diameter, this.maxDiameter, 0.01);
		this.opacity = lerp(this.opacity, 0, 0.08);

		if (this.position.y + this.diameter >= game.map.size / 2) {
			this.velocity.y *= 0.7;
			this.velocity.x += this.bx;
		}
	}
}