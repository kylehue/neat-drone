class Game {
	constructor() {
		this.camera = new Camera2D(drawingContext);
		this.map = new Map();

		//Objects
		this.drones = [];

		//Matter physics

	}

	setup() {
		for (var i = 0; i < 1; i++) {
			this.drones.push(new Drone)
		}
	}

	render() {
		this.camera.begin();
		this.camera.moveTo(this.drones[0].body.position.x, this.drones[0].body.position.y);
		this.camera.zoomTo(width * 4 + 50);

		this.map.render();

		//Render matter objects
		fill(12);
		for (let body of world.bodies) {
			if (!(body.self instanceof Drone)) {
				beginShape();
				for (let vert of body.vertices) {
					vertex(vert.x, vert.y);
				}
				endShape(CLOSE);
			}
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
		for (let drone of this.drones) {
			drone.update();
		}
	}
}