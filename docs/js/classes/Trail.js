//independent

class Trail {
	constructor(options) {
		options = options || {};

		//Movement
		this.position = {
			x: 0,
			y: 0
		};

		this.positionPrev = {
			x: 0,
			y: 0
		};

		this.angle = 0;

		//Vertices
		this.vertices = [];
		this._verticesLeft = [];
		this._verticesRight = [];

		//Options
		this.length = options.length || 50;
		this.broadness = options.broadness || 0.2;
		this.smoothness = options.smoothness || 0.3;
	}

	render() {
		fill(255, 50);
		beginShape()
		for (let vert of this.vertices) {
			curveVertex(vert.x, vert.y);
		}
		endShape(CLOSE);
		this.update();
	}

	moveTo() {
		let position = typeof arguments[0] == "object" ? {
			x: arguments[0].x,
			y: arguments[0].y
		} : {
			x: arguments[0],
			y: arguments[1]
		};

		const addVertex = (name, velocity) => {
			//Check if the array has vertices in it
			if (this[name].length > 0) {
				let recentVertexDistance = Trail.dist(this.position.x, this.position.y, this[name][this[name].length - 1].x, this[name][this[name].length - 1].y);
				//Only add a vertex if the recent vertex is far enough from the current position of trail
				if (recentVertexDistance > this.smoothness * 100) {
					this[name].push({
						x: this.position.x,
						y: this.position.y,
						velocity: velocity,
						timespan: 0
					});
				}
			} else {
				this[name].push({
					x: this.position.x,
					y: this.position.y,
					velocity: velocity,
					timespan: 0
				});
			}
		}

		//Only add if the position isn't the same as the old position
		if (this.position.x != position.x || this.position.y != position.y) {
			addVertex("_verticesRight", {
				x: Math.cos(this.angle + Math.PI * this.broadness),
				y: Math.sin(this.angle + Math.PI * this.broadness)
			});

			addVertex("_verticesLeft", {
				x: Math.cos(this.angle - Math.PI * this.broadness),
				y: Math.sin(this.angle - Math.PI * this.broadness)
			});
		}

		//Update position
		this.position = position;
	}

	update() {
		//Update angle
		this.angle = Math.atan2(this.position.y - this.positionPrev.y, this.position.x - this.positionPrev.x);

		//Update previous position
		this.positionPrev.x = Trail.lerp(this.positionPrev.x, this.position.x, this.smoothness);
		this.positionPrev.y = Trail.lerp(this.positionPrev.y, this.position.y, this.smoothness);

		//Update vertices
		let verticesLeftCopyReverse = this._verticesLeft.slice().reverse();
		let verticesRightCopy = this._verticesRight.slice();

		verticesRightCopy.push({
			x: this.position.x,
			y: this.position.y,
			velocity: {
				x: 0,
				y: 0
			}
		});

		this.vertices = verticesRightCopy.concat(verticesLeftCopyReverse);

		//Update position
		for (let vert of this.vertices) {
			vert.x += vert.velocity.x;
			vert.y += vert.velocity.y;
		}

		//Delete vertices when they reach max length
		for (let vert of this._verticesLeft) {
			vert.timespan++;
			if (vert.timespan > this.length) {
				this._verticesLeft.splice(this._verticesLeft.indexOf(vert), 1);
			}
		}

		for (let vert of this._verticesRight) {
			vert.timespan++;
			if (vert.timespan > this.length) {
				this._verticesRight.splice(this._verticesRight.indexOf(vert), 1);
			}
		}
	}

	static dist(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}

	static lerp(start, stop, per) {
		return per * (stop - start) + start;
	}
}