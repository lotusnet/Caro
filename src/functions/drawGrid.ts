const AXIS_MARGIN = 40;
const AXIS_TOP = AXIS_MARGIN;
const HORIZONTAL_TICK_SPACING = 10;
const VERTICAL_TICK_SPACING = 10;
const TICK_WIDTH = 10;
const TICKS_LINE_WIDTH = 0.5;
const TICKS_COLOR = "#2f4f4f";
const TICKS_COLOR2 = "#556b2f";
const AXIS_LINE_WIDTH = 1.0;
const AXIS_COLOR = "blue";

export const drawGrid = (
	canvas: HTMLCanvasElement,
	color: string,
	stepx: number,
	stepy: number,
	withAxes: boolean = true
) => {
	const context = canvas.getContext("2d");
	if (!context) return;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = color;
	context.lineWidth = 0.5;
	for (let i = stepx + 0.5; i < context?.canvas.width; i += stepx) {
		context.beginPath();
		context.moveTo(i, 0);
		context.lineTo(i, context.canvas.height);
		context.stroke();
	}
	for (let i = stepy + 0.5; i < context?.canvas.width; i += stepy) {
		context.beginPath();
		context.moveTo(0, i);
		context.lineTo(context.canvas.height, i);
		context.stroke();
	}

	if (withAxes) drawAxes(canvas);
};

const drawAxes = (canvas: HTMLCanvasElement) => {
	const context = canvas.getContext("2d");
	if (!context) return;

	context.save();
	context.strokeStyle = AXIS_COLOR;
	context.lineWidth = AXIS_LINE_WIDTH;

	drawVerticalAxis(context, canvas.width, canvas.height);
	drawHorizontalAxis(context, canvas.height);

	context.lineWidth = 0.5;
	context.lineWidth = TICKS_LINE_WIDTH;
	context.strokeStyle = TICKS_COLOR;

	drawVerticalAxisTicks(context, canvas.height);
	drawHorizontalAxisTicks(context, canvas.width, canvas.height);

	context.restore();
};

const drawVerticalAxis = (
	context: CanvasRenderingContext2D,
	canvasWidth: number,
	canvasHeight: number
) => {
	const axisOrigin = { x: AXIS_MARGIN, y: canvasHeight - AXIS_MARGIN };
	context.beginPath();
	context.moveTo(axisOrigin.x, axisOrigin.y);
	context.lineTo(canvasWidth - AXIS_MARGIN, axisOrigin.y);
	context.stroke();
};

const drawHorizontalAxis = (
	context: CanvasRenderingContext2D,
	canvasHeight: number
) => {
	const axisOrigin = { x: AXIS_MARGIN, y: canvasHeight - AXIS_MARGIN };
	context.beginPath();
	context.moveTo(axisOrigin.x, axisOrigin.y);
	context.lineTo(axisOrigin.x, AXIS_TOP);
	context.stroke();
};

const drawVerticalAxisTicks = (
	context: CanvasRenderingContext2D,
	canvasHeight: number
) => {
	let deltaX;
	const axisOrigin = { x: AXIS_MARGIN, y: canvasHeight - AXIS_MARGIN };
	const axisHeight = canvasHeight - AXIS_MARGIN - AXIS_TOP;
	const numVerticalTicks = axisHeight / VERTICAL_TICK_SPACING;
	for (let i = 1; i < numVerticalTicks; ++i) {
		context.save();
		context.beginPath();

		if (i % 5 === 0) {
			deltaX = TICK_WIDTH;
			context.strokeStyle = TICKS_COLOR2;
		} else deltaX = TICK_WIDTH / 2;

		context.moveTo(
			axisOrigin.x - deltaX,
			axisOrigin.y - i * VERTICAL_TICK_SPACING
		);
		context.lineTo(
			axisOrigin.x + deltaX,
			axisOrigin.y - i * VERTICAL_TICK_SPACING
		);
		context.stroke();
		context.restore();
	}
};

const drawHorizontalAxisTicks = (
	context: CanvasRenderingContext2D,
	canvasWidth: number,
	canvasHeight: number
) => {
	let deltaY;
	const axisOrigin = { x: AXIS_MARGIN, y: canvasHeight - AXIS_MARGIN };
	const axisWidth = canvasWidth - AXIS_MARGIN - AXIS_TOP;
	const numHorizontalTicks = axisWidth / HORIZONTAL_TICK_SPACING;
	for (let i = 1; i < numHorizontalTicks; ++i) {
		context.save();
		context.beginPath();

		if (i % 5 === 0) {
			deltaY = TICK_WIDTH;
			context.strokeStyle = TICKS_COLOR2;
		} else deltaY = TICK_WIDTH / 2;

		context.moveTo(
			axisOrigin.x + i * HORIZONTAL_TICK_SPACING,
			axisOrigin.y - deltaY
		);
		context.lineTo(
			axisOrigin.x + i * HORIZONTAL_TICK_SPACING,
			axisOrigin.y + deltaY
		);
		context.stroke();
		context.restore();
	}
};
