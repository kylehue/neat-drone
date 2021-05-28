class Rock {
	constructor() {
		let rockPathsSmall = ["M -16 -40 L 7 -30 L 15 -14 L 32 -5 L 34.8 10.6 L 18.8 36.2 L -10 34 L -30.8 10.6 L -36 -6 L -20 -30 Z", "M -12 -10 L 7 -25 L 25 -18 L 32 -3 L 24 -2 L 13 24 L -7 34 L -25.8 10.6 L -31 -6 L -25 -16 Z", "M 7 -32 L 36 -20 L 35 2 L 25 13 L 18 21 L 13 31 L -8 33 L -25.8 10.6 L -16 -2 L -27 -14 Z"];
		let rockPathsMedium = ["M -32 -51 L 12 -49 L 70 4 L 66 24 L 37 35 L 26 62 L -16 66 L -51.6 21.2 L -35 -16 L -54 -28 Z", "M -24 -42 L 42 -20 L 70 4 L 66 24 L 31 43 L 26 62 L -16 66 L -44 56 L -34 23 L -49 -5 Z", "M 24 -52 L 42 -20 L 70 4 L 66 24 L 41 34 L 26 62 L -12 51 L -44 56 L -50 -13 L -13 -37 Z"];
		let rockPathsBig = ["M 5 -60 L 72 -27 L 55 6 L 88 38 L 64 79 L 4 115 L -70 86 L -80 70 L -80 -20.8 L -42 -67 Z", "M -5 -70 L 18 -36 L 85 -1 L 78 28 L 23 103 L -53 91 L -74 37 L -68 10 L -87 -1 L -52 -77 Z", "M 36.3 -45.2 L 62.7 -46.4 L 70.4 -23.6 L 85.8 13.6 L 30.8 71.2 L -25 91 L -81.4 24.4 L -74.8 -16.4 L -99 -29 L -53.9 -75.2 Z"];
		let rockPaths = rockPathsSmall.concat(rockPathsMedium, rockPathsBig);

		let rockPath = random(rockPaths);
		if (Math.random() < 0.5) rockPath = random(rockPathsMedium);
		if (Math.random() < 0.8) rockPath = random(rockPathsSmall);
		let vertices = Vertices.fromPath(rockPath);
		let position = game.map.getRandomPosition(100);

		this.ignoreGravity = true;
		if (Math.random() < 0.2) this.ignoreGravity = false;

		let maxScale = 4;
		let offset = game.map.size / 4;
		this.scale = random(1, maxScale);

		position.y = position.y - game.map.planetOffset - offset;
		this.body = Bodies.fromVertices(position.x, position.y, vertices, {
			collisionFilter: {
				category: collisionMask.rock,
				mask: collisionMask.staticBody | collisionMask.drone | collisionMask.thruster | collisionMask.rock
			},
			density: map(this.scale, 1, maxScale, 0.04, 0.1),
			restitution: 0,
			friction: 1,
			frictionStatic: 1,
			self: this
		});


		Body.scale(this.body, this.scale, this.scale);

		for (let part of this.body.parts) {
			let rand = random(-10, 0);
			if (part != this.body.parts[0]) {
				//Scale slightly bigger to hide seperation lines
				Body.scale(part, 1.05, 1.05);
			}
		}

		World.add(world, this.body);
	}

	render() {
		fill(game.map.planetColor);
		noStroke();
		for (let part of this.body.parts) {
			if (part != this.body.parts[0]) {
				beginShape();
				for (let vert of part.vertices) {
					vertex(vert.x, vert.y);
				}
				endShape(CLOSE);
			}
		}
	}

	update() {
		if (this.body.position.y <= -game.map.size / 2) {
			Body.applyForce(this.body, this.body.position, {
				x: 0,
				y: 32 * this.body.density
			});
		}

		if (this.body.position.x <= -game.map.size / 2) {
			Body.applyForce(this.body, this.body.position, {
				x: 32 * this.body.density,
				y: 0
			});
		}

		if (this.body.position.x >= game.map.size / 2) {
			Body.applyForce(this.body, this.body.position, {
				x: -32 * this.body.density,
				y: 0
			});
		}

		if (!this.ignoreGravity) {
			let planetAngle = Math.atan2(game.map.planet.position.y - this.body.position.y, game.map.planet.position.x - this.body.position.x);
			Body.applyForce(this.body, this.body.position, {
				x: cos(planetAngle) * (14 * this.body.density),
				y: sin(planetAngle) * (14 * this.body.density)
			});
		}
	}
}