class Map {
	constructor() {
		this.size = 10000;
		this.bounds = {
			x: -this.size / 2,
			y: -this.size / 2,
			width: this.size,
			height: this.size
		};

		let _width = 300;
		this.ground = Bodies.rectangle(0, this.size / 2 + _width / 2, this.size, _width, {
			collisionFilter: {
				category: collisionMask.staticBody
			},
			isStatic: true,
			self: this
		});

		this.leftWall = Bodies.rectangle(-this.size / 2 - _width / 2, 0, _width, this.size, {
			collisionFilter: {
				category: collisionMask.staticBody
			},
			isStatic: true,
			self: this
		});

		this.rightWall = Bodies.rectangle(this.size / 2 + _width / 2, 0, _width, this.size, {
			collisionFilter: {
				category: collisionMask.staticBody
			},
			isStatic: true,
			self: this
		});

		World.add(world, [this.ground, this.leftWall, this.rightWall]);

		this.quadtree = new Quadtree(this.bounds);
	}

	render() {
		noStroke();
		fill("#060407");
		beginShape();
		rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		endShape();
	}
}