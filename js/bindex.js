function fillText(context, x, y, width, content = "hackCBS") {
	context.font = "48px serif";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillStyle = "white";
	context.fillText(content, x, y, width);
}

function fillCircle(context, x, y, radius, color = "green") {
	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI * 2, true);
	context.fillStyle = color;
	context.fill();
}

function randomDirction() {
	if (Math.random() > 0.5) return -1;
	else return 1;
}

class Ball {
	constructor({
		x,
		y,
		radius,
		text,
		textColor = "white",
		color = "red",
		directionX = 1,
		directionY = 1,
	}) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.text = text;
		this.textColor = textColor;
		this.directionX = directionX;
		this.directionY = directionY;
	}

	fillCircle(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		context.fillStyle = this.color;
		context.fill();
	}

	fillText(context) {
		context.beginPath();
		context.font = "48px serif";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = this.textColor;
		context.fillText(this.text, this.x, this.y, this.radius * 2);
	}

	updateCoordinates(radius, padding, width, height, dt, dx, dy) {
		this.radius = radius;

		if (this.x + this.radius >= width || this.x - this.radius <= padding) {
			if (this.x + this.radius >= width) {
				this.x = width - this.radius;
			} else if (this.x - this.radius <= padding) {
				this.x = this.radius;
			}
			this.directionX = -this.directionX;
		}

		if (this.y + this.radius >= height || this.y - this.radius <= padding) {
			if (this.y + this.radius >= height) {
				this.y = height - this.radius;
			} else if (this.y - this.radius <= padding) {
				this.y = this.radius;
			}
			this.directionY = -this.directionY;
		}

		this.x += dx * dt * this.directionX;
		this.y += dy * dt * this.directionY;
	}
}

(() => {
	const canvas = document.getElementById("game");
	const context = canvas.getContext("2d");

	const sliderInputRadius = document.getElementById("sliderInputRadius");
	const sliderInputSpeed = document.getElementById("sliderInputSpeed");
	const colorPicker = document.getElementById("favcolor");

	const min_radius = 20;
	let speed = 100;
	let dx = speed;
	let dy = speed;
	let start;

	const padding = 0;

	let width = canvas.width;
	let height = canvas.height;
	let ball1 = new Ball({
		x: width / 2,
		y: height / 2,
		radius: min_radius,
		text: "hackCBS",
		directionX: randomDirction(),
		directionY: randomDirction(),
	});
	let ball2;

	sliderInputSpeed.addEventListener("input", () => {
		let sp = parseFloat(sliderInputSpeed.value);
		dx = sp;
		dy = sp;
	});

	colorPicker.addEventListener("input", () => {
		ball1.color = colorPicker.value;
		ball2.color = colorPicker.value;
	});

	function step(timestamp) {
		if (start === undefined) {
			start = timestamp;
		}

		const dt = (timestamp - start) / 1000.0;
		start = timestamp;

		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;

		const radius = Math.max(min_radius, parseFloat(sliderInputRadius.value));
		if (!ball2) {
			ball2 = new Ball({
				x: width,
				y: radius,
				radius: radius,
				text: "Kronos",
				directionX: randomDirction(),
				directionY: randomDirction(),
			});
		}
		ball1.updateCoordinates(radius, padding, width, height, dt, dx, dy);
		ball2.updateCoordinates(radius, padding, width, height, dt, dx, dy);

		context.clearRect(0, 0, width, height);

		ball1.fillCircle(context);
		ball1.fillText(context);
		ball2.fillCircle(context);
		ball2.fillText(context);

		window.requestAnimationFrame(step);
	}

	window.requestAnimationFrame(step);
})();
