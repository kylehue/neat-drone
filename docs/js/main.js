//Matter
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Events = Matter.Events;
const Engine = Matter.Engine;
const engine = Engine.create();
const world = engine.world;
const World = Matter.World;
const Vertices = Matter.Vertices;
const SVG = Matter.Svg;
const Common = Matter.Common;
const Constraint = Matter.Constraint;
Common.setDecomp(decomp);

const collisionMask = {
	staticBody: Body.nextCategory(),
	drone: Body.nextCategory(),
	thruster: Body.nextCategory()
}

let game, neat;
let drone;
let flames = [];

function preload() {
	drone = loadImage("assets/drone.png");
	for (var i = 0; i < 4; i++) {
		flames.push(loadImage(`assets/thruster-flame/${i + 1}.png`));
	}
}

function setup() {
	createCanvas(innerWidth, innerHeight);
	game = new Game();
	game.setup();
	/*neat = new Neat(3, 2, 5, {
		populationSize: 1,
		mutationRate: 0,
		warnings: false
	});*/
}

function draw() {
	background(10);
	fill(255);
	stroke(255);

	game.update();
	Engine.update(engine);
	game.render();
}

function windowResized() {
	resizeCanvas(innerWidth, innerHeight);
}
