class Drone {
	constructor() {
		const bodyVertices = Vertices.fromPath("M -89 -62 L -30 -92 L 30 -92 L 89 -62 L 277 -115 L 275 -101 L 57 3 L 80 24 L 100 3 L 129 46 L 138 36 L 141 14 L 147 19 L 152 41 L 145 63 L 94 130 L 117 148 L 36 148 L 76 130 L 128 63 L 101 25 L 77 54 L 30 12 L -30 12 L -77 54 L -101 25 L -128 63 L -76 130 L -36 148 L -117 148 L -94 130 L -145 63 L -152 41 L -147 19 L -141 14 L -138 36 L -129 46 L -100 3 L -80 24 L -57 3 L -275 -101 L -277 -115 Z");
		const thrusterVertices = Vertices.fromPath("M -16.8 -54.4 L 16.8 -54.4 L 16.8 -44.8 L 32.8 2.4 L 32.8 33.6 L 16.8 59.2 L -16.8 59.2 L -32.8 33.6 L -32.8 2.4 L -16.8 -45.6 Z");
		let offset = 100;
		let position = createVector(random(-game.map.size / 2 + offset, game.map.size / 2 - offset), game.map.size / 2 - 200);
		let category = Body.nextCategory();
		this.body = Bodies.fromVertices(0, game.map.size / 2 - game.map.planetOffset - 200, bodyVertices, {
			collisionFilter: {
				category: collisionMask.drone,
				mask: collisionMask.staticBody | collisionMask.drone | collisionMask.thruster | collisionMask.rock,
				group: -category
			},
			density: 0.3,
			friction: 0.4,
			frictionAir: 0.0001,
			restitution: 0,
			self: this,
		});

		let bodyX = [];
		let bodyY = [];
		for (let vert of this.body.vertices) {
			bodyX.push(vert.x);
			bodyY.push(vert.y);
		}

		this.body.width = abs(min(bodyX) - max(bodyX));
		this.body.height = abs(min(bodyY) - max(bodyY))

		this.thrusterLeftBody = Bodies.fromVertices(this.body.position.x, this.body.position.y, thrusterVertices, {
			collisionFilter: {
				category: collisionMask.thruster,
				mask: collisionMask.staticBody | collisionMask.drone | collisionMask.thruster | collisionMask.rock,
				group: -category
			},
			density: 0.1,
			friction: 0.4,
			self: this
		});

		this.thrusterRightBody = Bodies.fromVertices(this.body.position.x, this.body.position.y, thrusterVertices, {
			collisionFilter: {
				category: collisionMask.thruster,
				mask: collisionMask.staticBody | collisionMask.drone | collisionMask.thruster | collisionMask.rock,
				group: -category
			},
			density: 0.1,
			friction: 0.4,
			self: this
		});

		let constraintLeftThruster = Constraint.create({
			bodyA: this.thrusterLeftBody,
			pointA: createVector(-0, 0),
			bodyB: this.body,
			pointB: createVector(-this.body.width / 2, -70),
			stiffness: 1,
			length: 0
		})

		let constraintRightThruster = Constraint.create({
			bodyA: this.thrusterRightBody,
			pointA: createVector(-0, 0),
			bodyB: this.body,
			pointB: createVector(this.body.width / 2, -70),
			stiffness: 1,
			length: 0
		})

		World.add(world, [this.body, this.thrusterLeftBody, constraintLeftThruster, this.thrusterRightBody, constraintRightThruster]);
		this.color = "#202234";
		this.particles = [];

		this.ignoreGravityField = false;

		//
		this.thrustPower = 30;
		this.thrusterAngleVelocity = 0.1;
		this.thrustingLeft = false;
		this.thrustingRight = false;
		this.thrusterLeftRotation = 0;
		this.thrusterRightRotation = 0;
		this.thrusterLeftRotationLimit = PI * 0.25;
		this.thrusterRightRotationLimit = PI * 0.75;

		this.thrusterLeftTrail = new Trail;
		this.thrusterRightTrail = new Trail;

		//
		this.angleOffset = -PI / 2;
		this.planetAngle = 0;
	}

	render() {
		//Draw the body
		let clr = color(this.color).levels;
		/*fill(this.color);
		stroke(clr[0] - 30, clr[1] - 30, clr[2] - 30);
		for (let part of this.body.parts) {
			if (part != this.body.parts[0]) {
				beginShape();
				for (let vert of part.vertices) {
					vertex(vert.x, vert.y);
				}
				endShape(CLOSE);
			}
		}*/

		//Body design
		push();
		translate(this.body.position.x, this.body.position.y);
		rotate(this.body.angle);
		image(images.drone, -this.body.width / 2, -this.body.height / 2 + 36, this.body.width, this.body.height);

		let bodyAngle = Math.atan2(sin(this.body.angle), cos(this.body.angle)); //constrained
		let isFalling = this.body.velocity.y > 5;
		let isLateral = bodyAngle > PI * 0.2 || bodyAngle < -PI * 0.2;
		//Red lights
		if (isFalling || isLateral) {
			let length = 20;
			let speed = 8;
			let anim = (frameCount % length) * speed;
			noStroke();
			fill(255, 100, 140, map(anim, 1, length * speed, 80, 0));
			beginShape();
			let offsetXA = -this.body.width / 4 - 13;
			let offsetXB = this.body.width / 4 + 13;
			let offsetY = -20;
			circle(offsetXA, offsetY, anim);
			circle(offsetXB, offsetY, anim);
			endShape();
		}
		pop();

		//Thrust flames
		if (this.thrustingLeft) {
			push();
			translate(this.thrusterLeftBody.position.x, this.thrusterLeftBody.position.y);
			rotate(this.thrusterLeftBody.angle);
			let img = images.flames[floor(random(images.flames.length))];
			let _width = 40;
			let _height = 120;
			image(img, -_width / 2, _height / 4, _width, _height);

			//Light
			noStroke();
			fill(255, 50, 0, random(10, 30))
			beginShape();
			circle(0, 100, random(130, 170));
			endShape();
			fill(255, 90, 50, random(10, 30))
			beginShape();
			circle(0, 90, random(80, 110));
			endShape();
			pop();
		}

		if (this.thrustingRight) {
			push();
			translate(this.thrusterRightBody.position.x, this.thrusterRightBody.position.y);
			rotate(this.thrusterRightBody.angle);
			let img = images.flames[floor(random(images.flames.length))];
			let _width = 40;
			let _height = 120;
			image(img, -_width / 2, _height / 4, _width, _height);

			//Light
			noStroke();
			fill(255, 50, 10, random(10, 30))
			beginShape();
			circle(0, 100, random(130, 170));
			endShape();
			fill(255, 90, 50, random(10, 30))
			beginShape();
			circle(0, 90, random(80, 110));
			endShape();
			pop();
		}

		//Render particles
		for (let particle of this.particles) {
			if (particle) {
				particle.render();
			}
		}

		//Thruster left trail
		const trailLeftOpacity = map(this.thrusterLeftBody.speed, 0, 200, 0, 35);
		noStroke();
		fill(255, trailLeftOpacity);
		beginShape();
		for (let vert of this.thrusterLeftTrail.vertices) {
			curveVertex(vert.x, vert.y);
		}
		endShape(CLOSE);

		//Thruster right trail
		const trailRightOpacity = map(this.thrusterRightBody.speed, 0, 200, 0, 35);
		fill(255, trailRightOpacity);
		beginShape();
		for (let vert of this.thrusterRightTrail.vertices) {
			curveVertex(vert.x, vert.y);
		}
		endShape(CLOSE);

		//Draw left thruster
		/*fill(this.color);
		stroke(clr[0] - 30, clr[1] - 30, clr[2] - 30, 100);
		strokeWeight(1);
		for (let part of this.thrusterLeftBody.parts) {
			if (part != this.thrusterLeftBody.parts[0]) {
				beginShape();
				for (let vert of part.vertices) {
					vertex(vert.x, vert.y);
				}
				endShape(CLOSE);
			}
		}

		//Draw right thruster
		fill(clr[0] + 20, clr[1] + 20, clr[2] + 20, 100);
		stroke(clr[0], clr[1], clr[2]);
		strokeWeight(1);
		for (let part of this.thrusterRightBody.parts) {
			if (part != this.thrusterRightBody.parts[0]) {
				beginShape();
				for (let vert of part.vertices) {
					vertex(vert.x, vert.y);
				}
				endShape(CLOSE);
			}
		}*/

		//Thruster left design
		let thrusterWidth = 65; //svg size
		let thrusterHeight = 113; //svg size
		push();
		translate(this.thrusterLeftBody.position.x, this.thrusterLeftBody.position.y);
		rotate(this.thrusterLeftBody.angle);
		image(images.thruster, -thrusterWidth / 2, -thrusterHeight / 2, thrusterWidth, thrusterHeight);
		pop();

		//Thruster right design
		push();
		translate(this.thrusterRightBody.position.x, this.thrusterRightBody.position.y);
		rotate(this.thrusterRightBody.angle);
		image(images.thruster, -thrusterWidth / 2, -thrusterHeight / 2, thrusterWidth, thrusterHeight);
		pop();

		this.thrustingLeft = false;
		this.thrustingRight = false;
	}

	update() {
		//Disable physics rotation
		Body.setAngularVelocity(this.thrusterLeftBody, 0);
		Body.setAngularVelocity(this.thrusterRightBody, 0);

		//Set thrusters' angle relative to body angle
		Body.setAngle(this.thrusterLeftBody, this.body.angle + this.thrusterLeftRotation);
		Body.setAngle(this.thrusterRightBody, this.body.angle + this.thrusterRightRotation);

		//Check controls
		if (keyIsDown(65)) this.thrustLeft(10);
		if (keyIsDown(68)) this.thrustRight(10);
		if (keyIsDown(72)) this.rotateThruster(this.thrusterLeftBody, -this.thrusterAngleVelocity);
		if (keyIsDown(74)) this.rotateThruster(this.thrusterLeftBody, this.thrusterAngleVelocity);
		if (keyIsDown(75)) this.rotateThruster(this.thrusterRightBody, -this.thrusterAngleVelocity);
		if (keyIsDown(76)) this.rotateThruster(this.thrusterRightBody, this.thrusterAngleVelocity);
		if (keyIsDown(37)) {
			this.rotateThruster(this.thrusterLeftBody, -this.thrusterAngleVelocity);
			this.rotateThruster(this.thrusterRightBody, -this.thrusterAngleVelocity);
		}
		if (keyIsDown(39)) {
			this.rotateThruster(this.thrusterLeftBody, this.thrusterAngleVelocity);
			this.rotateThruster(this.thrusterRightBody, this.thrusterAngleVelocity);
		}

		//Don't let the drone go outside the map size
		if (dist(0, 0, this.body.position.x, this.body.position.y) > game.map.size / 2) {
			const worldAngle = atan2(this.body.position.y, this.body.position.x);
			Body.applyForce(this.body, this.body.position, {
				x: -cos(worldAngle) * 50,
				y: -sin(worldAngle) * 50
			});
		}

		//Update particles/smoke effect
		for (let particle of this.particles) {
			if (particle) {
				particle.update();

				if (particle.opacity <= 1 || particle.diameter >= particle.maxDiameter * 0.9) {
					this.particles.splice(this.particles.indexOf(particle), 1);
				}
			}
		}

		const planetY = game.map.size * 2;
		this.planetAngle = atan2(planetY - this.body.position.y, game.map.planet.position.x - this.body.position.x);
		if (this.ignoreGravityField) {
			//Apply gravity
			Body.applyForce(this.body, this.body.position, {
				x: cos(this.planetAngle) * 13,
				y: sin(this.planetAngle) * 13
			});
		} else {
			//Apply gravity if the body is inside the gravity field
			const planetSize = game.map.size * 2;
			const planetDistance = dist(this.body.position.x, this.body.position.y, game.map.planet.position.x, planetY) - planetSize;
			let gravityPull = map(planetDistance, game.map.planetGravityField, 0, 0, 1);
			gravityPull = constrain(gravityPull, 0, 1);
			if (planetDistance < game.map.planetGravityField) {
				Body.applyForce(this.body, this.body.position, {
					x: cos(this.planetAngle) * 13 * gravityPull,
					y: sin(this.planetAngle) * 13 * gravityPull
				});
			}
		}

		this.thrusterLeftTrail.moveTo(this.thrusterLeftBody.position);
		this.thrusterLeftTrail.update();

		this.thrusterRightTrail.moveTo(this.thrusterRightBody.position);
		this.thrusterRightTrail.update();
	}

	rotateThruster(thruster, rotation) {
		const _rotate = (thrusterRotation) => {
			const angle = Math.atan2(sin(this[thrusterRotation] - this.angleOffset), cos(this[thrusterRotation] - this.angleOffset));

			//Check if turning left
			if (rotation < 0) {
				if (angle < this.thrusterLeftRotationLimit) return;
				this[thrusterRotation] += rotation;
			} else {
				if (angle > this.thrusterRightRotationLimit) return;
				this[thrusterRotation] += rotation;
			}
		}

		if (thruster == this.thrusterLeftBody) {
			_rotate("thrusterLeftRotation");
		}

		if (thruster == this.thrusterRightBody) {
			_rotate("thrusterRightRotation");
		}
	}

	thrustLeft(power) {
		const angle = this.thrusterLeftBody.angle + this.angleOffset;
		Body.applyForce(this.thrusterLeftBody, this.thrusterLeftBody.position, {
			x: cos(angle) * power,
			y: sin(angle) * power
		});

		//Add particles
		this.addParticles(this.thrusterLeftBody.position, this.thrusterLeftBody.angle - this.angleOffset, 2);
		this.thrustingLeft = true;
	}

	thrustRight(power) {
		const angle = this.thrusterRightBody.angle + this.angleOffset;
		Body.applyForce(this.thrusterRightBody, this.thrusterRightBody.position, {
			x: cos(angle) * power,
			y: sin(angle) * power
		});

		//Add particles
		this.addParticles(this.thrusterRightBody.position, this.thrusterRightBody.angle - this.angleOffset, 2);
		this.thrustingRight = true;
	}

	addParticles(position, angle, amount) {
		for (var i = 0; i < amount; i++) {
			this.particles.push(new Particle(position, angle))
		}
	}
}