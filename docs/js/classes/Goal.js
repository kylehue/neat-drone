class Goal {
	constructor(x, y) {
		this.position = createVector(x, y);
		this.diameter = 100;
		this.color = "yellow";
	}

	render() {
		fill(this.color);
		beginShape();
		circle(this.position.x, this.position.y, this.diameter);
		endShape();
		this.color = "yellow";
	}

	addToQuadtree() {
		game.map.quadtree.insert({
			x: this.position.x - this.diameter / 2,
			y: this.position.y - this.diameter / 2,
			width: this.diameter,
			height: this.diameter,
			self: this
		});
	}
}