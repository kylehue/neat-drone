class Game {
	constructor() {
		this.camera = new Camera2D(drawingContext);
		this.map = new Map();

		//Objects
		this.drones = [];
		this.droneCount = 1;
	}

	setup() {
		//Add drones
		for (var i = 0; i < this.droneCount; i++) {
			this.drones.push(new Drone)
		}

		//Add stars
		let starCount = sqrt((this.map.size * 0.01) * (this.map.size * 0.01)) * 10;
		for (var i = 0; i < starCount; i++) {
			this.map.stars.push(new Star(random(-this.map.size / 2, this.map.size / 2), random(-this.map.size / 2, this.map.size / 2)));
		}

		//Add rocks
		let rockCount = sqrt((this.map.size * 0.01) * (this.map.size * 0.01));
		for (var i = 0; i < rockCount; i++) {
			this.map.rocks.push(new Rock);
		}
	}

	render() {
		this.camera.begin();
		this.camera.moveTo(this.drones[0].body.position.x, this.drones[0].body.position.y);
		this.camera.zoomTo(width * 4);

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

		for (let drone of this.drones) {
			drone.update();
		}
	}

	isVisible(position, offset) {
		offset = offset || 0;
		if (position.x + offset > this.camera.viewport.left && position.x - offset < this.camera.viewport.right && position.y + offset > this.camera.viewport.top && position.y - offset < this.camera.viewport.bottom) {
			return true;
		}

		return false;
	}
}