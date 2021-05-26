//Matter
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Events = Matter.Events;
const Engine = Matter.Engine;
const World = Matter.World;

let game, neat;

function setup() {
	createCanvas(innerWidth, innerHeight);
	game = new Game();
	neat = new Neat(3, 2, 5, {
		populationSize: 1,
		mutationRate: 0,
		warnings: false
	});
}

function draw() {
	background(10);
	fill(255);
	stroke(255);

	game.update();
	game.render();
}

function windowResized() {
	resizeCanvas(innerWidth, innerHeight);
}