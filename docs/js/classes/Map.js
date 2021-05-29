class Map {
	constructor() {
		this.size = 30000;
		this.bounds = {
			x: -this.size / 2,
			y: -this.size / 2,
			width: this.size,
			height: this.size
		};

		this.stars = [];
		this.rocks = [];

		this.planetScaleY = 0.355;

		this.planetSize = (this.size * 2) * this.planetScaleY;
		this.planetOffset = this.size / 2;
		this.planetGravityField = this.size / 10;
		this.planet = Bodies.circle(0, (this.size / 2 + this.planetSize - this.planetOffset) * this.planetScaleY, this.planetSize, {
			collisionFilter: {
				category: collisionMask.staticBody
			},
			isStatic: true,
			self: this
		}, 250 * this.planetScaleY);

		//Scale Y axis smaller to avoid lag
		Body.scale(this.planet, 1, this.planetScaleY);

		World.add(world, this.planet);

		this.quadtree = new Quadtree(this.bounds);
		this.background = "#100b12";
		this.planetColor = "#382358";
	}

	render() {
		push();
		//Draw map
		noStroke();
		beginShape();
		fill(this.background);
		circle(0, 0, this.size);
		endShape();

		//Clip 
		drawingContext.clip();

		//Draw stars
		for (let star of this.stars) {
			if (game.isVisible(star.position, star.diameter * 2)) star.render();
		}

		//Draw the planet
		const planetColor = color(this.planetColor).levels;
		const planetDiameter = this.planetSize * 2;
		const gravityFieldDiameter = this.planetGravityField * 2;
		beginShape();
		const stepCount = this.planetGravityField / 200;
		let startLerpVal = 1;
		for (var lerpVal = startLerpVal; lerpVal > 0; lerpVal -= startLerpVal / stepCount) {
			if (lerpVal <= startLerpVal / stepCount) fill(planetColor[0], planetColor[1], planetColor[2], 255);
			else fill(planetColor[0], planetColor[1], planetColor[2], 10);
			arc(0, planetDiameter * this.planetScaleY / 2, planetDiameter + gravityFieldDiameter * lerpVal * lerpVal, (planetDiameter * this.planetScaleY) + gravityFieldDiameter * lerpVal * lerpVal, 0, TAU);
		}
		endShape();

		pop();

		//Draw rocks
		for (let rock of this.rocks) {
			if (game.isVisible(rock.body.position, 100 * rock.scale)) rock.render();
		}
	}

	update() {
		for (let star of this.stars) {
			if (game.isVisible(star.position, star.diameter * 2)) star.parallax();
		}

		for (let rock of this.rocks) {
			rock.update();
		}
	}

	getRandomPosition() {
		const angle = random(-PI, PI);
		const spread = 1.3;
		let radius = random(this.size / 4) * spread;
		radius += random(this.size / 4) * spread;
		return {
			x: cos(angle) * radius,
			y: sin(angle) * radius
		}
	}
}