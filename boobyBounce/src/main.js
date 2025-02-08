import { Ball } from "./ball.js";
import "./index.css";
import "./reset.css";

(() => {
	const canvas = document.getElementById("game");
	const context = canvas.getContext("2d");

	const sliderInputRadius = document.getElementById("sliderInputRadius");
	const sliderInputSpeed = document.getElementById("sliderInputSpeed");
	const colorPicker = document.getElementById("favcolor");

	const min_radius = 20;
	let speed = sliderInputRadius.min;
	// let dx = speed;
	// let dy = speed;
	let start;

	const padding = 0;

	let width = canvas.width;
	let height = canvas.height;
	const ball1 = new Ball({
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
		radius: 20,
		text: "A",
		density: 0.000001,
		color: "red",
		VelocityX: 50,
		VelocityY: 0,
	});
	let ball2 = new Ball({
		x: min_radius,
		y: min_radius,
		radius: 20,
		text: "B",
		density: 0.00001,
		color: "blue",
		VelocityX: 100,
		VelocityY: 100,
	});

	sliderInputSpeed.addEventListener("input", () => {
		let sp = parseFloat(sliderInputSpeed.value);
		// if the balls are on the ground
		if (!ball1.vel.VelocityX) {
			ball1.vel.VelocityX += sp;
		}
		if (!ball1.vel.VelocityY) {
			ball1.vel.VelocityY += -sp;
		}
		if (!ball2.vel.VelocityX) {
			ball2.vel.VelocityX += sp;
		}
		if (!ball2.vel.VelocityY) {
			ball2.vel.VelocityY += -sp;
		}
		ball1.vel.VelocityX = sp * Math.sign(ball1.vel.VelocityX);
		ball1.vel.VelocityY = sp * Math.sign(ball1.vel.VelocityY);
		if (ball2) {
			ball2.vel.VelocityX = sp * Math.sign(ball2.vel.VelocityX);
			ball2.vel.VelocityY = sp * Math.sign(ball2.vel.VelocityY);
		}
	});

	sliderInputSpeed.addEventListener("change", () => {
		sliderInputSpeed.value = sliderInputSpeed.min;
	});

	colorPicker.addEventListener("input", () => {
		ball1.color = colorPicker.value;
		ball2.color = colorPicker.value;
	});

	function step(timestamp) {
		if (start === undefined) {
			start = timestamp;
		}

		// to prevent dt getting higher than 1/60, i.e. more than 60 fps
		let dt = Math.min((timestamp - start) / 1000.0, 0.016599999999998546);
		start = timestamp;

		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;

		const radius = Math.max(min_radius, parseFloat(sliderInputRadius.value));
		ball1.updateCoordinates(radius, padding, width, height, dt, 980);
		ball2.updateCoordinates(radius, padding, width, height, dt, 980);
		ball1.collision(ball2);

		context.clearRect(0, 0, width, height);

		ball1.fillCircle(context);
		ball1.fillText(context);
		ball2.fillCircle(context);
		ball2.fillText(context);

		window.requestAnimationFrame(step);
	}

	window.requestAnimationFrame(step);
})();
