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
	neat = new Neat(10, 2, 8, {
		populationSize: 50,
		mutationRate: 0.25,
		warnings: true
	});

	game = new Game();
	game.setup();
}

let speed = 10;
let genSavepoint = 30;
let evalTime = new Date().getTime();
let maxEvalTime = 30000;

function draw() {
	let clr = color(game.map.background).levels;
	background(clr[0] - 2, clr[1] - 2, clr[2] - 2);
	fill(255);
	stroke(255);

	game.render();

	for (var i = 0; i < speed; i++) {
		game.update();
		Engine.update(engine);
	}

	if (!game.drones.length || new Date().getTime() - evalTime > maxEvalTime) {
		nextEval();
		evalTime = new Date().getTime();
	}
}

function windowResized() {
	resizeCanvas(innerWidth, innerHeight);
}

//NEAT
function nextEval() {
	for (let drone of game.drones) {
		drone.calculateFitness();
	}
	neat.population.evolve();
	game = new Game();
	game.setup();

	if (neat.population.generation % genSavepoint == 0) {
		saveGen();
	}
}

function saveGen() {
	saveJSON(neat.toJSON(), `GEN ${neat.population.generation + 1} ${new Date().toLocaleTimeString()}`);
}

function keyPressed() {
	if (keyCode == 16) {
		saveGen();
	}
}