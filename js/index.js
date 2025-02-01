function fillText(context, x, y, content = "hackCBS") {
	context.font = "48px serif";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillStyle = "white";
	context.fillText(content, x, y);
}
function fillCircle(context, x, y, radius, color = "green") {
	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI * 2, true);
	context.fillStyle = color;
	context.fill();
}

(() => {
	const canvas = document.getElementById("game");
	const width = canvas.width;
	const height = canvas.height;
	const sliderInputRadius = document.getElementById("sliderInputRadius");
	const sliderInputSpeed = document.getElementById("sliderInputSpeed");
	const min_radius = 20;
	const context = canvas.getContext("2d");

	let x = width / 2;
	let y = height / 2;
	let speed = 100;
	let dx = speed;
	let dy = speed;
	// we need direction to be seperated from the speed, because while increasing/decreasing speed we were unintentionally maniplulating the direction also
	let dircetionX = 1;
	let dircetionY = 1;
	let start;

	const padding = 0;

	sliderInputSpeed.addEventListener("input", (event) => {
		let sp = parseFloat(sliderInputSpeed.value);
		dx = sp;
		dy = sp;
	});

	function step(timestamp) {
		if (start === undefined) {
			start = timestamp;
		}

		const dt = (timestamp - start) / 1000.0;
		start = timestamp;

		const width = window.innerWidth;
		const height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
		const radius = Math.max(min_radius, parseFloat(sliderInputRadius.value));

		if (x + radius >= width || x - radius <= padding) {
			if (x + radius >= width) {
				x = width - radius;
			} else if (x - radius <= padding) {
				x = radius;
			}
			dircetionX = -dircetionX;
		}

		if (y + radius >= height || y - radius <= padding) {
			if (y + radius >= height) {
				y = height - radius;
			} else if (y - radius <= padding) {
				y = radius;
			}
			dircetionY = -dircetionY;
			// dy = -dy;
		}

		x += dx * dt * dircetionX;
		y += dy * dt * dircetionY;
		context.fillStyle = "black";
		context.fillRect(
			padding,
			padding,
			width - 2 * padding,
			height - 2 * padding,
		);
		// context.strokeRect(0, 0, canvas.width, canvas.height);
		fillCircle(context, x, y, radius, "red");
		// fillText(context, x, y);

		// console.log(elapsed);

		window.requestAnimationFrame(step);
	}

	window.requestAnimationFrame(step);
	// fullCircle(context, width / 3, height / 3, radius, "red");
	// context.beginPath();
	// context.arc(width / 3, height / 3, radius, 0, Math.PI, true);
	// context.fillStyle = "red";
	// context.fill();
})();
