class Game {
	constructor() {
		this.camera = new Camera2D(drawingContext);
		this.map = new Map();

		//Objects
		this.drones = [];

		//Matter physics
		this.engine = Engine.create();
		this.world = this.engine.world;
	}

	setup() {

	}

	render() {
		this.camera.begin();
		this.camera.zoomTo(this.map.size + 50);


		this.map.render();

		//Render matter objects
		noFill();
		stroke(255);
		strokeWeight(1);
		for (let body of this.world.bodies) {
			beginShape();
			for (let vert of body.vertices) {
				vertex(vert.x, vert.y);
			}
			endShape(CLOSE);
		}

		this.camera.end();
	}

	update() {
		//Update physics engine
		Engine.update(this.engine);
	}
}