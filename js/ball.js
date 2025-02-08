import { dist } from "./utils.js";
export class Ball {
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
		this.radius = radius;
		this.color = color;
		this.text = text;
		this.textColor = textColor;
		this.drag = 0.99;
		this.density = density;
		// do same for position vector also
		this.vel = { VelocityX, VelocityY };
		this.pos = { x, y };
		this.acl = { accelarationX: 0, accelarationY: 0 };
		this.updateResitution();
	}

	fillCircle(context) {
		context.beginPath();
		context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true);
		context.fillStyle = this.color;
		context.fill();
	}
	get mass() {
		return this.density * Math.PI * this.radius * this.radius;
	}

	updateResitution() {
		const baseLine = 0.5;
		const scale = 0.1;

		this.resitution = baseLine + scale * Math.log10(this.mass);
		this.resitution = Math.max(0.5, Math.min(0.95, this.resitution));
	}

	fillText(context) {
		context.beginPath();
		context.font = "48px serif";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = this.textColor;
		context.fillText(this.text, this.pos.x, this.pos.y, this.radius * 2);
	}

	updateCoordinates(radius, padding, width, height, dt, gravity = 980) {
		if (this.radius != radius) {
			this.radius = radius;
			this.updateResitution();
		}
		this.acl.accelarationY = gravity;

		if (
			Math.abs(this.vel.VelocityX) <= 5 &&
			Math.abs(this.vel.VelocityY) <= 5
		) {
			this.vel.VelocityX = 0;
			this.vel.VelocityY = 0;
			this.pos.y = height - this.radius;
			return;
		}

		this.vel.VelocityX += this.acl.accelarationX * dt;
		this.vel.VelocityY += this.acl.accelarationY * dt;
		this.vel.VelocityX *= this.drag;
		this.vel.VelocityY *= this.drag;

		if (
			this.pos.x + this.radius >= width ||
			this.pos.x - this.radius <= padding
		) {
			if (this.pos.x + this.radius >= width) {
				this.pos.x = width - this.radius;
				this.vel.VelocityX *= -this.resitution;
			} else if (this.pos.x - this.radius <= padding) {
				this.pos.x = this.radius;
				this.vel.VelocityX *= -this.resitution;
			}
		}

		if (
			this.pos.y + this.radius >= height ||
			this.pos.y - this.radius <= padding
		) {
			if (this.pos.y + this.radius >= height) {
				this.pos.y = height - this.radius;
				this.vel.VelocityY *= -this.resitution;
				// we can multiply VelocityX with some decimal for accounting friction with ground
			} else if (this.pos.y - this.radius <= padding) {
				this.pos.y = this.radius;
				this.vel.VelocityY *= -this.resitution;
			}
		}

		this.pos.x += this.vel.VelocityX * dt;
		this.pos.y += this.vel.VelocityY * dt;
	}

	collision(other) {
		let dist_between_balls = dist(this.pos, other.pos);
		console.log(dist_between_balls > this.radius + other.radius);
	}
}
