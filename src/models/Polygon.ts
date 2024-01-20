export type Point = {
	x: number;
	y: number;
};

export type Rect = {
	left: number;
	top: number;
	width: number;
	height: number;
};

export class Polygon {
	centerX: number;
	centerY: number;
	radius: number;
	sides: number;
	startAngle: number;
	strokeStyle: string | CanvasGradient | CanvasPattern;
	fillStyle: string | CanvasGradient | CanvasPattern;
	filled: boolean;

	constructor(
		centerX: number,
		centerY: number,
		radius: number,
		sides: number,
		startAngle: number,
		strokeStyle: string | CanvasGradient | CanvasPattern,
		fillStyle: string | CanvasGradient | CanvasPattern,
		filled: boolean
	) {
		this.centerX = centerX;
		this.centerY = centerY;
		this.radius = radius;
		this.sides = sides;
		this.startAngle = startAngle;
		this.strokeStyle = strokeStyle;
		this.fillStyle = fillStyle;
		this.filled = filled;
	}

	getPoints() {
		let points: Point[] = [],
			angle = this.startAngle || 0;

		for (let i = 0; i < this.sides; ++i) {
			points.push({
				x: this.centerX + this.radius * Math.sin(angle),
				y: this.centerY - this.radius * Math.cos(angle),
			});
			angle += (2 * Math.PI) / this.sides;
		}
		return points;
	}

	createPath(context: CanvasRenderingContext2D) {
		let points = this.getPoints();

		context.beginPath();

		context.moveTo(points[0].x, points[0].y);

		for (let i = 1; i < this.sides; ++i) {
			context.lineTo(points[i].x, points[i].y);
		}

		context.closePath();
	}

	stroke(context: CanvasRenderingContext2D) {
		context.save();
		this.createPath(context);
		context.strokeStyle = this.strokeStyle;
		context.stroke();
		context.restore();
	}

	fill(context: CanvasRenderingContext2D) {
		context.save();
		this.createPath(context);
		context.fillStyle = this.fillStyle;
		context.fill();
		context.restore();
	}

	move(x: number, y: number) {
		this.centerX = x;
		this.centerY = y;
	}
}
