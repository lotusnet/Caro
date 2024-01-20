import { Point } from "models/Polygon";
import { drawCentroid } from "./drawUtils";

const RING_INNER_RADIUS = 35;
const RING_OUTER_RADIUS = 55;
const ANNOTATION_FILL_STYLE = "rgba(0,0,230,0.9)";
const ANNOTATION_TEXT_SIZE = 12;

const TICK_WIDTH = 10;
const TICK_LONG_STROKE_STYLE = "rgba(100,140,230,0.9)";
const TICK_SHORT_STROKE_STYLE = "rgba(100,140,230,0.7)";

const TRACKING_DIAL_STROKING_STYLE = "rgba(100,140,230,0.5)";

const GUIDEWIRE_STROKE_STYLE = "goldenrod";
const GUIDEWIRE_FILL_STYLE = "rgba(250,250,0,0.6)";

export const drawDial = (canvas: HTMLCanvasElement, radius: number) => {
	const circle = { x: canvas.width / 2, y: canvas.height / 2, radius: radius };
	const loc = { x: circle.x, y: circle.y };

	const context = canvas.getContext("2d");

	if (!context) return;
	context.shadowOffsetX = 2;
	context.shadowOffsetY = 2;
	context.shadowBlur = 4;
	context.textAlign = "center";
	context.textBaseline = "middle";

	const drawRing = () => {
		if (!context) return;
		drawRingOuterCircle();

		context.strokeStyle = "rgba(0,0,0,0.1)";
		context.arc(
			circle.x,
			circle.y,
			circle.radius + RING_INNER_RADIUS,
			0,
			Math.PI * 2,
			false
		);
		context.fillStyle = "rgba(100,140,230,0.1)";
		context.fill();
		context.stroke();
	};

	const drawRingOuterCircle = () => {
		if (!context) return;
		context.shadowColor = "rgba(0,0,0,0.7)";
		context.shadowOffsetX = 3;
		context.shadowOffsetY = 3;
		context.shadowBlur = 6;
		context.strokeStyle = TRACKING_DIAL_STROKING_STYLE;
		context.beginPath();
		context.arc(
			circle.x,
			circle.y,
			circle.radius + RING_OUTER_RADIUS - TICK_WIDTH,
			0,
			Math.PI * 2,
			true
		);
		context.stroke();
	};

	const drawTickInnerCircle = () => {
		if (!context) return;
		context.save();
		context.beginPath();
		context.strokeStyle = "rgba(0,0,0,0.1)";
		context.arc(
			circle.x,
			circle.y,
			circle.radius + RING_INNER_RADIUS - TICK_WIDTH,
			0,
			Math.PI * 2,
			false
		);
		context.stroke();
		context.restore();
	};

	const drawTick = (angle: number, radius: number, cnt: number) => {
		if (!context) return;
		const tickWidth = cnt % 4 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;
		context?.beginPath();
		context.moveTo(
			circle.x + Math.cos(angle) * (radius - tickWidth),
			circle.y + Math.sin(angle) * (radius - tickWidth)
		);
		context.lineTo(
			circle.x + Math.cos(angle) * radius,
			circle.y + Math.sin(angle) * radius
		);
		context.strokeStyle = TICK_SHORT_STROKE_STYLE;
		context.stroke();
	};

	const drawTicks = () => {
		if (!context) return;
		const radius = circle.radius + RING_INNER_RADIUS;
		const angleMax = 2 * Math.PI;
		const angleDelta = Math.PI / 64;
		context.save();
		for (let angle = 0, cnt = 0; angle < angleMax; angle += angleDelta, cnt++) {
			drawTick(angle, radius, cnt++);
		}
		context.restore();
	};

	const drawAnnotations = () => {
		const radius = circle.radius + RING_INNER_RADIUS;
		if (!context) return;
		context.save();
		context.fillStyle = ANNOTATION_FILL_STYLE;
		context.font = ANNOTATION_TEXT_SIZE + "px Helvetica";
		for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 8) {
			context.beginPath();
			context.fillText(
				((angle * 180) / Math.PI).toFixed(0),
				circle.x + Math.cos(angle) * (radius - TICK_WIDTH * 2),
				circle.y - Math.sin(angle) * (radius - TICK_WIDTH * 2)
			);
		}
		context.restore();
	};

	const getEndPoint = () => {
		let endpt: Point = { x: 0, y: 0 };
		if (!context) return endpt;
		const canvas = context.canvas;
		const circle = {
			x: canvas.width / 2,
			y: canvas.height / 2,
			radius: radius,
		};
		const angle = -Math.PI / 4;
		const radius2 = circle.radius + RING_OUTER_RADIUS;

		if (loc.x >= circle.x) {
			endpt = {
				x: circle.x + radius2 * Math.cos(angle),
				y: circle.y + radius2 * Math.sin(angle),
			};
		} else {
			endpt = {
				x: circle.x - radius2 * Math.cos(angle),
				y: circle.y - radius2 * Math.sin(angle),
			};
		}
		return endpt;
	};

	drawCentroid(context, { x: circle.x, y: circle.y });
	//drawCentroidGuidwire(context, getEndPoint());
	drawRing();
	drawTickInnerCircle();
	drawTicks();
	drawAnnotations();
};

export const drawCentroidGuidwire = (
	context: CanvasRenderingContext2D | null,
	endpt: Point
) => {
	if (!context) return;
	const canvas = context.canvas;
	const circle = { x: canvas.width / 2, y: canvas.height / 2, radius: 150 };
	// const angle = -Math.PI / 4;
	// const radius = circle.radius + RING_OUTER_RADIUS;
	// let endpt: Point = { x: 0, y: 0 };
	// if (loc.x >= circle.x) {
	// 	endpt = {
	// 		x: circle.x + radius * Math.cos(angle),
	// 		y: circle.y + radius * Math.sin(angle),
	// 	};
	// } else {
	// 	endpt = {
	// 		x: circle.x - radius * Math.cos(angle),
	// 		y: circle.y - radius * Math.sin(angle),
	// 	};
	// }
	context.save();

	context.strokeStyle = GUIDEWIRE_STROKE_STYLE;
	context.fillStyle = GUIDEWIRE_FILL_STYLE;

	context.beginPath();
	context.moveTo(circle.x, circle.y);
	context.lineTo(endpt.x, endpt.y);
	context.stroke();

	context.beginPath;
	context.strokeStyle = TICK_LONG_STROKE_STYLE;
	context.arc(endpt.x, endpt.y, 5, 0, Math.PI * 2, false);
	context.fill();
	context.stroke();
	context.restore();
};
