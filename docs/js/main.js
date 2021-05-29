//Matter
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Events = Matter.Events;
const Engine = Matter.Engine;
const engine = Engine.create();
const world = engine.world;
world.gravity.y = 0;
const World = Matter.World;
const Vertices = Matter.Vertices;
const SVG = Matter.Svg;
const Common = Matter.Common;
const Constraint = Matter.Constraint;
Common.setDecomp(decomp);

const collisionMask = {
	staticBody: Body.nextCategory(),
	drone: Body.nextCategory(),
	thruster: Body.nextCategory(),
	rock: Body.nextCategory()
}

let game, neat;

const images = {};
images.flames = [];

function preload() {
	images.drone = loadImage("assets/drone_small.png");
	images.thruster = loadImage("assets/thruster_small.png");
	for (var i = 0; i < 4; i++) {
		images.flames.push(loadImage(`assets/thruster-flame/${i + 1}_small.png`));
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
	let clr = color(game.map.background).levels;
	background(clr[0] - 2, clr[1] - 2, clr[2] - 2);
	fill(255);
	stroke(255);

	game.render();
	game.update();
	Engine.update(engine);
}

function windowResized() {
	resizeCanvas(innerWidth, innerHeight);
	//game = new Game();
	//game.setup();
}
