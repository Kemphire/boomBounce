export function dist(v1, v2) {
	return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
}

export function randomDirection() {
	if (Math.random() > 0.5) return -1;
	else return 1;
}

export function subtractPos(v1, v2) {
	return { x: v1.x - v2.x, y: v1.y - v2.y };
}

export function subtractVel(v1, v2) {
	return {
		VelocityX: v1.VelocityX - v2.VelocityX,
		VelocityY: v1.VelocityY - v2.VelocityY,
	};
}

export function dotProdPosVel(post, vel) {
	return post.x * vel.VelocityX + post.y * vel.VelocityY;
}

export function scalarProd(scalar, vectorPos) {
	return { x: vectorPos.x * scalar, y: vectorPos.y * scalar };
}

export function magnitudeVelocity(vel) {
	return Math.sqrt(
		vel.VelocityX * vel.VelocityX + vel.VelocityY * vel.VelocityY,
	);
}
