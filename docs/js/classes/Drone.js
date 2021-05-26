class Drone {
	constructor() {
		const bodyVertices = Vertices.fromPath("M -89 -62 L -30 -92 L 30 -92 L 89 -62 L 277 -115 L 275 -101 L 57 3 L 80 24 L 100 3 L 129 46 L 138 36 L 141 14 L 147 19 L 152 41 L 145 63 L 94 130 L 117 148 L 36 148 L 76 130 L 128 63 L 101 25 L 77 54 L 30 12 L -30 12 L -77 54 L -101 25 L -128 63 L -76 130 L -36 148 L -117 148 L -94 130 L -145 63 L -152 41 L -147 19 L -141 14 L -138 36 L -129 46 L -100 3 L -80 24 L -57 3 L -275 -101 L -277 -115 Z");
		const thrusterVertices = Vertices.fromPath("M -16.8 -54.4 L 16.8 -54.4 L 16.8 -44.8 L 32.8 2.4 L 32.8 33.6 L 16.8 59.2 L -16.8 59.2 L -32.8 33.6 L -32.8 2.4 L -16.8 -45.6 Z");
		let offset = 100;
		let position = createVector(random(-game.map.size / 2 + offset, game.map.size / 2 - offset), random(-game.map.size / 2 + offset, game.map.size / 2 - offset));

		let category = Body.nextCategory();
		this.body = Bodies.fromVertices(position.x, position.y, bodyVertices, {
			collisionFilter: {
				category: collisionMask.drone,
				mask: collisionMask.staticBody | collisionMask.drone | collisionMask.thruster,
				group: -category
			},
			density: 0.3,
			friction: 0.4,
			frictionAir: 0.0001,
			restitution: 0,
			self: this
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
				mask: collisionMask.staticBody | collisionMask.drone | collisionMask.thruster,
				group: -category
			},
			density: 0.1,
			self: this
		});

		this.thrusterRightBody = Bodies.fromVertices(this.body.position.x, this.body.position.y, thrusterVertices, {
			collisionFilter: {
				category: collisionMask.thruster,
				mask: collisionMask.staticBody | collisionMask.drone | collisionMask.thruster,
				group: -category
			},
			density: 0.1,
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

		this.thrustPower = 30;
		this.thrusterAngleVelocity = 0.1;
		this.thrustingLeft = false;
		this.thrustingRight = false;

		//Point thrusters downwards
		this.angleOffset = -PI / 2;
		console.log(this)
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

		//Add body design
		push();
		translate(this.body.position.x, this.body.position.y);
		rotate(this.body.angle);
		image(drone, -this.body.width / 2, -this.body.height / 2 + 36, this.body.width, this.body.height);

		//Lights
		noStroke();
		let length = 20;
		let speed = 8;
		let anim = (frameCount % length) * speed;
		fill(255, 100, 140, map(anim, 1, length * speed, 80, 0));
		beginShape();
		let offsetXA = -this.body.width / 4 - 13;
		let offsetXB = this.body.width / 4 + 13;
		let offsetY = -20;
		circle(offsetXA, offsetY, anim);
		circle(offsetXB, offsetY, anim);
		endShape();
		pop();

		//Thrust flames
		if (this.thrustingLeft) {
			push();
			translate(this.thrusterLeftBody.position.x, this.thrusterLeftBody.position.y);
			rotate(this.thrusterLeftBody.angle);
			let img = flames[floor(random(flames.length))];
			let _width = 40;
			let _height = 120;
			image(img, -_width / 2, _height / 4, _width, _height);

			//Light
			noStroke();
			fill(255, 50, 0, random(10, 30))
			beginShape();
			circle(0, 100, random(130, 170));
			endShape();
			pop();
		}

		if (this.thrustingRight) {
			push();
			translate(this.thrusterRightBody.position.x, this.thrusterRightBody.position.y);
			rotate(this.thrusterRightBody.angle);
			let img = flames[floor(random(flames.length))];
			let _width = 40;
			let _height = 120;
			image(img, -_width / 2, _height / 4, _width, _height);

			//Light
			noStroke();
			fill(255, 50, 0, random(10, 30))
			beginShape();
			circle(0, 100, random(130, 170));
			endShape();
			pop();
		}

		//Render particles
		for (let particle of this.particles) {
			if (particle) {
				particle.render();
			}
		}

		//Draw left thruster
		fill(this.color);
		stroke(clr[0] - 30, clr[1] - 30, clr[2] - 30);
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
		fill(clr[0] + 20, clr[1] + 20, clr[2] + 20);
		stroke(clr[0], clr[1], clr[2]);
		for (let part of this.thrusterRightBody.parts) {
			if (part != this.thrusterRightBody.parts[0]) {
				beginShape();
				for (let vert of part.vertices) {
					vertex(vert.x, vert.y);
				}
				endShape(CLOSE);
			}
		}

		this.thrustingLeft = false;
		this.thrustingRight = false;
	}

	update() {
		//Disable physics rotation
		Body.setAngularVelocity(this.thrusterLeftBody, 0);
		Body.setAngularVelocity(this.thrusterRightBody, 0);

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

		//Don't let the drone go higher than the map
		if (this.body.position.y <= -game.map.size / 2) {
			Body.applyForce(this.body, this.body.position, {
				x: 0,
				y: 50
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
	}

	rotateThruster(thruster, rotation) {
		//Check if turning left
		if (rotation > 0) {
			//Limit the angle to 45 degrees
			if (thruster.angle + this.angleOffset < this.angleOffset * 0.5) {
				Body.rotate(thruster, rotation);
			}
		} else {
			if (thruster.angle + this.angleOffset > this.angleOffset * 1.5) {
				Body.rotate(thruster, rotation);
			}
		}
	}

	thrustLeft(power) {
		let angle = this.thrusterLeftBody.angle + this.angleOffset;
		Body.applyForce(this.thrusterLeftBody, this.thrusterLeftBody.position, {
			x: cos(angle) * power,
			y: sin(angle) * power
		});

		//Add particles
		this.addParticles(this.thrusterLeftBody.position, this.thrusterLeftBody.angle - this.angleOffset, 1);
		this.thrustingLeft = true;
	}

	thrustRight(power) {
		let angle = this.thrusterRightBody.angle + this.angleOffset;
		Body.applyForce(this.thrusterRightBody, this.thrusterRightBody.position, {
			x: cos(angle) * power,
			y: sin(angle) * power
		});

		//Add particles
		this.addParticles(this.thrusterRightBody.position, this.thrusterRightBody.angle - this.angleOffset, 1);
		this.thrustingRight = true;
	}

	addParticles(position, angle, amount) {
		for (var i = 0; i < amount; i++) {
			this.particles.push(new Particle(position, angle))
		}
	}
}