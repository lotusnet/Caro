import { Stack } from "@mui/material";
import { drawGrid } from "functions/drawGrid";
import {
	drawCentroid,
	drawCentroidGuidewire,
	drawDegreeAnnotations,
	drawDegreeDialTicks,
	drawDegreeOuterDial,
	drawDegreeTickDial,
	drawGuidewires,
	drawTrackingDial,
	erase,
	getContext,
	getRubberBandRectangle,
	restoreDrawingSurface,
	saveDrawingSurface,
	windowToCanvas,
} from "functions/drawUtils";
import { Point, Polygon, Rect } from "models/Polygon";
import { VFC, useEffect, useRef, useState } from "react";
import styles from "./DrawingPolygon.module.css";
import DrawingPolygonControls from "./DrawingPolygonControls";

const ERASER_LINE_WIDTH = 1;
const ERASER_SHADOW_STYLE = "rgb(0,0,0)";
const ERASER_STROKE_STYLE = "rgb(0,0,255)";
const ERASER_SHADOW_OFFSET = -5;
const ERASER_SHADOW_BLUR = 20;

export const DrawingPolygon: VFC = () => {
	const canvasRef = useRef(null);

	let mouseDown: Point = { x: 0, y: 0 };
	let lastPoint: Point = { x: 0, y: 0 };
	let rubberBandRect: Rect = { left: 0, top: 0, width: 0, height: 0 };

	let dragging: boolean = false;
	let draggingOffsetX: number;
	let draggingOffsetY: number;
	let draggingPolygon: Polygon | null;
	let drawingSurfaceImageData: ImageData | null;
	let polygonRotating: Polygon | null;
	let rotatingLockAngle: number;
	let rotatingLockEngaged: boolean;

	const [polygons, setPolygons] = useState<Polygon[]>([]);
	const [strokeColor, setStrokeColor] = useState("red");
	const [fillColor, setFillColor] = useState("orange");
	const [sides, setSides] = useState(8);
	const [startAngle, setStartAngle] = useState(0);
	const [toolMode, setToolMode] = useState("draw");
	const [eraserWidth, setEraserWidth] = useState(25);
	const [eraserShape, setEraserShape] = useState("circle");
	const [fill, setFill] = useState(false);

	const [guidewires, setGuidewires] = useState(false);

	useEffect(() => {
		const context = getContext(canvasRef.current);
		if (!context) return;
		const canvas = context.canvas;

		drawGrid(canvas, "lightgrey", 10, 10);

		// MEMO : 再描画時にポリゴンを描画する
		drawPolygons(context);

		// context.save();
		// context.restore();
	});

	const drawPolygon = (
		context: CanvasRenderingContext2D,
		polygon: Polygon,
		angle: number | null
	) => {
		if (!context) return;

		const tx = polygon.centerX;
		const ty = polygon.centerY;

		context.save();

		context.translate(tx, ty);

		if (angle) {
			context.rotate(angle);
		}

		polygon.centerX = 0;
		polygon.centerY = 0;

		//context.beginPath();
		polygon.createPath(context);
		polygon.stroke(context);

		if (polygon.filled) {
			polygon.fill(context);
		}

		context.restore();

		polygon.centerX = tx;
		polygon.centerY = ty;
	};

	// const drawPolygon = (context: CanvasRenderingContext2D, polygon: Polygon) => {
	// 	if (!context) return;

	// 	context.beginPath();
	// 	polygon.createPath(context);
	// 	polygon.stroke(context);

	// 	if (polygon.filled) {
	// 		polygon.fill(context);
	// 	}
	// };

	const drawPolygons = (context: CanvasRenderingContext2D) => {
		polygons.forEach((polygon) => drawPolygon(context, polygon, null));
	};

	const drawRubberbandShape = (
		context: CanvasRenderingContext2D,
		sides: number,
		startAngle: number
	) => {
		const polygon = new Polygon(
			mouseDown.x,
			mouseDown.y,
			rubberBandRect.width,
			sides,
			(Math.PI / 180) * startAngle,
			strokeColor,
			fillColor,
			fill
		);
		drawPolygon(context, polygon, null);

		if (!dragging) {
			polygons.push(polygon);
		}
	};

	const updateRubberband = (loc: Point) => {
		const context = getContext(canvasRef.current);
		if (!context) return;
		rubberBandRect = getRubberBandRectangle(loc, mouseDown);
		drawRubberbandShape(context, sides, startAngle);
	};

	const startDragging = (context: CanvasRenderingContext2D, loc: Point) => {
		drawingSurfaceImageData = saveDrawingSurface(context);
		mouseDown.x = loc.x;
		mouseDown.y = loc.y;
	};
	const startEditing = (canvas: HTMLCanvasElement) => {
		canvas.style.cursor = "grab";
		setToolMode("edit");
	};
	const stopEditing = (canvas: HTMLCanvasElement, mode: string) => {
		canvas.style.cursor = mode === "draw" ? "crosshair" : "pointer";

		setToolMode(mode);

		polygonRotating = null;
		rotatingLockEngaged = false;
		rotatingLockAngle = 0;
		const context = getContext(canvasRef.current);
		if (context) {
			context.clearRect(0, 0, canvas.width, canvas.height);
			drawPolygons(context);
		}
	};

	// イベントハンドラー
	const handleOnMousedown = (e: MouseEvent) => {
		const canvas: any = canvasRef.current;
		if (!canvas) return;
		const context = getContext(canvas);
		if (!context) return;

		const loc = windowToCanvas(canvas, e.clientX, e.clientY);
		e.preventDefault();

		if (isEdit()) {
			polygons.forEach((polygon) => {
				polygon.createPath(context);
				if (context.isPointInPath(loc.x, loc.y)) {
					startDragging(context, loc);
					dragging = true;
					draggingPolygon = polygon;
					draggingOffsetX = loc.x - polygon.centerX;
					draggingOffsetY = loc.y - polygon.centerY;
					return;
				}
			});
		} else if (isRotate()) {
			if (polygonRotating) {
				stopRotatingPolygon(loc);
				redraw(context);
			}

			polygonRotating = getSelectedPolygon(context, loc);

			if (polygonRotating) {
				drawRotationAnnotations(context, loc);

				if (!rotatingLockEngaged) {
					rotatingLockEngaged = true;
					rotatingLockAngle = Math.atan(
						(loc.y - polygonRotating.centerY) /
							(loc.x - polygonRotating.centerX)
					);
				}
			}
		} else {
			startDragging(context, loc);

			lastPoint.x = loc.x;
			lastPoint.y = loc.y;
			dragging = true;
		}
	};

	const handleOnMousemove = (e: MouseEvent) => {
		const canvas: any = canvasRef.current;
		if (!canvas) return;
		const context = getContext(canvas);
		if (!context) return;

		e.preventDefault();

		const loc = windowToCanvas(canvas, e.clientX, e.clientY);
		if (isEdit() && draggingPolygon) {
			draggingPolygon.move(loc.x - draggingOffsetX, loc.y - draggingOffsetY);
			context.clearRect(0, 0, canvas.width, canvas.height);
			drawGrid(canvas, "lightgray", 10, 10);
			drawPolygons(context);
		} else if (isRotate() && polygonRotating) {
			if (rotatingLockEngaged) {
				let angle =
					Math.atan(
						(loc.y - polygonRotating.centerY) /
							(loc.x - polygonRotating.centerX)
					) - rotatingLockAngle;

				redraw(context);

				drawPolygon(context, polygonRotating, angle);
				drawRotationAnnotations(context, loc);
			}
		} else {
			if (dragging) {
				if (toolMode === "draw") {
					restoreDrawingSurface(context, drawingSurfaceImageData);
					updateRubberband(loc);

					if (guidewires) {
						drawGuidewires(context, mouseDown);
					}
				} else if (isEraser()) {
					eraseLast();
					drawEraser(loc);
				}
				lastPoint.x = loc.x;
				lastPoint.y = loc.y;
			}
		}
	};

	const handleOnMouseup = (e: MouseEvent) => {
		const canvas: any = canvasRef.current;
		if (!canvas) return;
		const context = getContext(canvas);
		if (!context) return;

		const loc = windowToCanvas(canvas, e.clientX, e.clientY);
		draggingPolygon = null;
		dragging = false;

		if (toolMode === "draw") {
			restoreDrawingSurface(context, drawingSurfaceImageData);
			updateRubberband(loc);
		} else if (isEraser()) {
			eraseLast();
		}
	};

	const eraseLines = () => {
		const canvas: any = canvasRef.current;
		if (!canvas) return;
		const context = getContext(canvas);
		if (!context) return;
		drawingSurfaceImageData = erase(context, (canvas) =>
			drawGrid(canvas, "lightgray", 10, 10)
		);
		setPolygons([]);
	};

	const handleEditModeChange = (toolMode: string) => {
		const canvas: any = canvasRef.current;
		if (!canvas) return;
		if (toolMode === "edit") {
			startEditing(canvas);
		} else {
			stopEditing(canvas, toolMode);
		}
	};

	const isEdit = () => toolMode === "edit";
	const isEraser = () => toolMode === "erase";
	const isRotate = () => toolMode === "rotate";

	// 消しゴム
	const setDrawPathForEraser = (loc: Point) => {
		const context = getContext(canvasRef.current);
		if (!context) return;

		context.beginPath();

		if (eraserShape === "circle") {
			context.arc(loc.x, loc.y, eraserWidth / 2, 0, Math.PI * 2, false);
		} else {
			context.rect(
				loc.x - eraserWidth / 2,
				loc.y - eraserWidth / 2,
				eraserWidth,
				eraserWidth
			);
		}
		context.clip();
	};

	const setErasePathForEraser = () => {
		const context = getContext(canvasRef.current);
		if (!context) return;

		context.beginPath();

		if (eraserShape === "circle") {
			context.arc(
				lastPoint.x,
				lastPoint.y,
				eraserWidth / 2 + ERASER_LINE_WIDTH,
				0,
				Math.PI * 2,
				false
			);
		} else {
			context.rect(
				lastPoint.x - eraserWidth / 2 - ERASER_LINE_WIDTH,
				lastPoint.y - eraserWidth / 2 - ERASER_LINE_WIDTH,
				eraserWidth + ERASER_LINE_WIDTH * 2,
				eraserWidth + ERASER_LINE_WIDTH * 2
			);
		}
		context.clip();
	};

	const setEraserAttributes = () => {
		const context = getContext(canvasRef.current);
		if (!context) return;

		context.lineWidth = ERASER_LINE_WIDTH;
		context.shadowColor = ERASER_SHADOW_STYLE;
		context.shadowOffsetX = ERASER_SHADOW_OFFSET;
		context.shadowOffsetY = ERASER_SHADOW_OFFSET;
		context.shadowBlur = ERASER_SHADOW_BLUR;
		context.strokeStyle = ERASER_STROKE_STYLE;
	};

	const eraseLast = () => {
		const context = getContext(canvasRef.current);
		if (!context) return;

		context.save();

		setErasePathForEraser();
		drawGrid(context.canvas, "lightgrey", 10, 10);

		context.restore();
	};

	const drawEraser = (loc: Point) => {
		const context = getContext(canvasRef.current);
		if (!context) return;

		context.save();

		setEraserAttributes();
		setDrawPathForEraser(loc);
		context.stroke();

		context.restore();
	};

	// 回転ダイアルの描画
	const getSelectedPolygon = (
		context: CanvasRenderingContext2D,
		loc: Point
	) => {
		if (!context) return null;

		for (let i = 0; i < polygons.length; ++i) {
			var polygon = polygons[i];

			polygon.createPath(context);
			if (context.isPointInPath(loc.x, loc.y)) {
				startDragging(context, loc);
				draggingOffsetX = loc.x - polygon.centerX;
				draggingOffsetY = loc.y - polygon.centerY;
				return polygon;
			}
		}
		return null;
	};

	const stopRotatingPolygon = (loc: Point) => {
		if (!polygonRotating) return;
		let angle =
			Math.atan(
				(loc.y - polygonRotating.centerY) / (loc.x - polygonRotating.centerX)
			) - rotatingLockAngle;

		polygonRotating.startAngle += angle;

		polygonRotating = null;
		rotatingLockEngaged = false;
		rotatingLockAngle = 0;
	};

	const drawRotationAnnotations = (
		context: CanvasRenderingContext2D,
		loc: Point
	) => {
		if (!context || !polygonRotating) return;

		drawCentroid(context, {
			x: polygonRotating.centerX,
			y: polygonRotating.centerY,
		});
		drawCentroidGuidewire(context, loc, polygonRotating, rotatingLockAngle);

		drawTrackingDial(context, polygonRotating);
		drawDegreeOuterDial(context, polygonRotating);
		context.fillStyle = "rgba(100, 140, 230, 0.1)";
		context.fill();

		context.beginPath();
		drawDegreeOuterDial(context, polygonRotating);
		context.stroke();

		drawDegreeDialTicks(context, polygonRotating);
		drawDegreeTickDial(context, polygonRotating);
		drawDegreeAnnotations(context, polygonRotating);
	};

	const redraw = (context: CanvasRenderingContext2D) => {
		if (!context) return;
		const canvas = context.canvas;

		context.clearRect(0, 0, canvas.width, canvas.height);
		drawGrid(canvas, "lightgray", 10, 10);
		drawPolygons(context);
	};

	return (
		<>
			<Stack
				direction="column"
				alignItems="center"
				spacing={2}
				className={styles.parent}
			>
				<canvas
					width={1300}
					height={1300}
					className={styles.canvas}
					ref={canvasRef}
					onMouseDown={(e) => handleOnMousedown(e.nativeEvent)}
					onMouseMove={(e) => handleOnMousemove(e.nativeEvent)}
					onMouseUp={(e) => handleOnMouseup(e.nativeEvent)}
				>
					Canvas not supported.
				</canvas>
				<DrawingPolygonControls
					color={strokeColor}
					fillColor={fillColor}
					side={sides}
					startAngle={startAngle}
					toolMode={toolMode}
					eraserWidth={eraserWidth}
					eraserShape={eraserShape}
					fill={fill}
					guidewires={guidewires}
					setColor={setStrokeColor}
					setFillColor={setFillColor}
					setSide={setSides}
					setStartAngle={setStartAngle}
					setToolMode={handleEditModeChange}
					setEraserWidth={setEraserWidth}
					setEraserShape={setEraserShape}
					setFill={setFill}
					setGuidewires={setGuidewires}
					eraseLines={eraseLines}
				/>
			</Stack>
		</>
	);
};

export default DrawingPolygon;
