export function dist(v1, v2) {
	return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
}

export function randomDirection() {
	if (Math.random() > 0.5) return -1;
	else return 1;
}
