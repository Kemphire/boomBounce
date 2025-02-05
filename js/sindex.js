function randomDirection() {
	if (Math.random() > 0.5) return -1;
	else return 1;
}

class Ball {
	constructor({
		x,
		y,
		radius,
		text,
		density,
		textColor = "white",
		color = "red",
		VelocityX = 0,
		VelocityY = 0,
	}) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.text = text;
		this.textColor = textColor;
		this.VelocityX = VelocityX;
		this.VelocityY = VelocityY;
		this.accelarationX = 0;
		this.accelarationY = 0;
		this.restituion = 0.9;
		this.drag = 0.99;
		this.density = density;
		// do same for position vector also
		this.vel = { VelocityX, VelocityY };
	}

	fillCircle(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		context.fillStyle = this.color;
		context.fill();
	}
	get mass() {
		return this.density * Math.PI * this.radius * this.radius;
	}

	fillText(context) {
		context.beginPath();
		context.font = "48px serif";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = this.textColor;
		context.fillText(this.text, this.x, this.y, this.radius * 2);
	}

	updateCoordinates(radius, padding, width, height, dt, gravity = 980) {
		this.radius = radius;
		this.accelarationY = gravity;

		if (Math.abs(this.VelocityX) <= 5 && Math.abs(this.VelocityY) <= 5) {
			this.VelocityX = 0;
			this.VelocityY = 0;
			this.y = height - this.radius;
			return;
		}

		this.VelocityX += this.accelarationX * dt;
		this.VelocityY += this.accelarationY * dt;
		this.VelocityX *= this.drag;
		this.VelocityY *= this.drag;

		if (this.x + this.radius >= width || this.x - this.radius <= padding) {
			if (this.x + this.radius >= width) {
				this.x = width - this.radius;
				this.VelocityX *= -this.restituion;
			} else if (this.x - this.radius <= padding) {
				this.x = this.radius;
				this.VelocityX *= -this.restituion;
			}
		}

		if (this.y + this.radius >= height || this.y - this.radius <= padding) {
			if (this.y + this.radius >= height) {
				this.y = height - this.radius;
				this.VelocityY *= -this.restituion;
				// we can multiply VelocityX with some decimal for accounting friction with ground
			} else if (this.y - this.radius <= padding) {
				this.y = this.radius;
				this.VelocityY *= -this.restituion;
			}
		}

		this.x += this.VelocityX * dt;
		this.y += this.VelocityY * dt;
	}

	detectCollision(anotherBall) {
		let dist = Math.sqrt(
			(this.x - anotherBall.x) ** 2 + (this.y - anotherBall.y) ** 2,
		);
		if (dist > this.radius + anotherBall.radius) return;
		else {
			let overLap = dist - (this.radius + anotherBall.radius);
			this.x += overLap / 2;
			this.y += overLap / 2;
			anotherBall.x -= overLap / 2;
			anotherBall.y -= overLap / 2;
			this.VelocityX *= -this.restituion;
			this.VelocityY *= -this.restituion;
			anotherBall.VelocityX *= -anotherBall.restituion;
			anotherBall.VelocityY *= -anotherBall.restituion;
			console.error("Balls collided");
		}
	}
}

(() => {
	const canvas = document.getElementById("game");
	const context = canvas.getContext("2d");

	const sliderInputRadius = document.getElementById("sliderInputRadius");
	const sliderInputSpeed = document.getElementById("sliderInputSpeed");
	const colorPicker = document.getElementById("favcolor");

	const min_radius = 20;
	let speed = 500;
	// let dx = speed;
	// let dy = speed;
	let start;

	const padding = 0;

	let width = canvas.width;
	let height = canvas.height;
	let ball1 = new Ball({
		x: width / 2,
		y: height / 2,
		radius: min_radius,
		text: "🚀",
		VelocityX: speed * randomDirection(),
		VelocityY: speed * randomDirection(),
		density: 10,
	});
	let ball2;

	sliderInputSpeed.addEventListener("input", () => {
		let sp = parseFloat(sliderInputSpeed.value);
		// if the balls are on the ground
		if (!ball1.VelocityX) {
			ball1.VelocityX += sp;
		}
		if (!ball1.VelocityY) {
			ball1.VelocityY += -sp;
		}
		if (!ball2.VelocityX) {
			ball2.VelocityX += sp;
		}
		if (!ball2.VelocityY) {
			ball2.VelocityY += -sp;
		}
		ball1.VelocityX = sp * Math.sign(ball1.VelocityX);
		ball1.VelocityY = sp * Math.sign(ball1.VelocityY);
		if (ball2) {
			ball2.VelocityX = sp * Math.sign(ball2.VelocityX);
			ball2.VelocityY = sp * Math.sign(ball2.VelocityY);
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
		if (!ball2) {
			ball2 = new Ball({
				x: width,
				y: radius,
				radius: radius,
				text: "Kronos",
				VelocityX: speed * randomDirection(),
				VelocityY: speed * randomDirection(),
				density: 10,
			});
		}
		ball1.updateCoordinates(radius, padding, width, height, dt, 1300);
		ball2.updateCoordinates(radius, padding, width, height, dt, 1300);
		ball1.detectCollision(ball2);

		context.clearRect(0, 0, width, height);

		ball1.fillCircle(context);
		ball1.fillText(context);
		ball2.fillCircle(context);
		ball2.fillText(context);

		window.requestAnimationFrame(step);
	}

	window.requestAnimationFrame(step);
})();
