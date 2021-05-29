class Game {
	constructor() {
		world.bodies = [];
		this.camera = new Camera2D(drawingContext);
		this.map = new Map();

		//Objects
		this.drones = [];
		this.goals = [];
		//this.droneCount = 1;
	}

	setup() {
		//Add drones
		for (var i = 0; i < neat.populationSize; i++) {
			this.drones.push(new Drone(neat.population.genomes[i]));
		}

		//Add stars
		let starCount = sqrt((this.map.size * 0.01) * (this.map.size * 0.01)) * 3;
		for (var i = 0; i < starCount; i++) {
			let position = this.map.getRandomPosition();
			const planetY = game.map.size * 2;
			const planetSize = game.map.size * 2;

			//Find a new position if the planet is blocking the star
			while (dist(position.x, position.y, 0, planetY) < planetSize) {
				position = this.map.getRandomPosition();
			}

			//this.map.stars.push(new Star(position.x, position.y));
		}

		//Add rocks
		let rockThreshold = 0.0005;
		for (var i = 0; i < sqrt((this.map.size * rockThreshold) * (this.map.size * rockThreshold)); i++) {
			let position = game.map.getRandomPosition();
			const planetY = game.map.size * 2;
			const planetSize = game.map.size * 2;
			const offset = game.map.planetGravityField;

			//Find a new position if the planet is blocking the rock OR the position is outside the map size
			while (dist(position.x, position.y, 0, planetY) < planetSize + offset || dist(0, 0, position.x, position.y) > game.map.size / 2) {
				position = game.map.getRandomPosition();
			}

			this.map.rocks.push(new Rock(position.x, position.y));
		}

		//Add goals
		let goalThreshold = 0.004;
		for (var i = 0; i < sqrt((this.map.size * goalThreshold) * (this.map.size * goalThreshold)); i++) {
			let position = game.map.getRandomPosition();
			const planetY = game.map.size * 2;
			const planetSize = game.map.size * 2;
			const offset = game.map.planetGravityField - 500;

			//Find a new position if the planet is blocking the goal OR the position is outside the map size
			while (dist(position.x, position.y, 0, planetY) < planetSize + offset || dist(0, 0, position.x, position.y) > game.map.size / 2) {
				position = game.map.getRandomPosition();
			}

			this.goals.push(new Goal(position.x, position.y));
		}
	}

	render() {
		this.camera.begin();
		this.camera.moveTo(this.drones[0].body.position.x, this.drones[0].body.position.y);
		this.camera.zoomTo(game.map.size + 1000  /*width * 5*/ );

		this.map.render();

		//Render matter objects
		/*fill(50, 10, 20);
		for (let body of world.bodies) {
			if (!(body.self instanceof Drone) && !(body.self instanceof Rock)) {
				beginShape();
				for (let vert of body.vertices) {
					vertex(vert.x, vert.y);
				}
				endShape(CLOSE);
			}
		}*/

		for (let goal of this.goals) {
			goal.render();
		}

		for (let drone of this.drones) {
			drone.render();
		}

		noFill();
		stroke(255);
		strokeWeight(2);
		beginShape();
		arc(this.drones[0].body.position.x, this.drones[0].body.position.y - 300, 300, 300, 0, 0);
		endShape();

		this.camera.end();
	}

	update() {
		this.map.update();

		for (let goal of this.goals) {
			goal.addToQuadtree();
		}

		for (let drone of this.drones) {
			drone.update();
		}

		this.map.quadtree.clear();
	}

	isVisible(position, offset) {
		offset = offset || 0;
		if (position.x + offset > this.camera.viewport.left && position.x - offset < this.camera.viewport.right && position.y + offset > this.camera.viewport.top && position.y - offset < this.camera.viewport.bottom) {
			return true;
		}

		return false;
	}
}