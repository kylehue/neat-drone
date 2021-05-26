class Map {
	constructor() {
		this.size = 500;
		this.bounds = {
			x: -this.size / 2,
			y: -this.size / 2,
			width: this.size,
			height: this.size
		};
		
		this.quadtree = new Quadtree(this.bounds);
	}

	render() {
		noStroke();
		fill(20);
		beginShape();
		rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		endShape();
	}
}