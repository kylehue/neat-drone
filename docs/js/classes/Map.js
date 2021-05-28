class Map {
	constructor() {
		this.size = 12000;
		this.bounds = {
			x: -this.size / 2,
			y: -this.size / 2,
			width: this.size,
			height: this.size
		};

		this.stars = [];
		this.rocks = [];

		let offsetY = 750;

		this.planetSize = this.size * 2;
		this.planetOffset = 1000;
		this.planet = Bodies.circle(0, this.size / 2 + this.planetSize - this.planetOffset, this.planetSize, {
			collisionFilter: {
				category: collisionMask.staticBody
			},
			isStatic: true,
			self: this
		}, 250);

		World.add(world, this.planet);

		this.quadtree = new Quadtree(this.bounds);
		this.background = "#100b12";
		this.planetColor = "#521124";
	}

	render() {
		noStroke();
		fill(this.background);
		beginShape();
		rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		endShape();

		for (let star of this.stars) {
			if (game.isVisible(star.position, star.diameter * 2)) star.render();
		}

		for (let rock of this.rocks) {
			if (game.isVisible(rock.body.position, 100 * rock.scale)) rock.render();
		}

		fill(this.planetColor);
		noStroke();
		beginShape();
		circle(this.planet.position.x, this.planet.position.y, this.planet.circleRadius * 2)
		endShape();
	}

	update() {
		for (let star of this.stars) {
			if (game.isVisible(star.position, star.diameter * 2)) star.parallax();
		}

		for (let rock of this.rocks) {
			rock.update();
		}
	}

	getRandomPosition(offset) {
		return {
			x: random(-this.size / 2 + offset, this.size / 2 -offset),
			y: random(-this.size / 2 + offset, this.size / 2 -offset)
		}
	}
}