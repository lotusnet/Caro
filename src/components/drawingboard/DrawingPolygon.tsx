import { Stack } from "@mui/material";
import { drawGrid } from "functions/drawGrid";
import {
	drawGuidewires,
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

	const drawPolygon = (context: CanvasRenderingContext2D, polygon: Polygon) => {
		context.beginPath();
		polygon.createPath(context);
		polygon.stroke(context);

		if (polygon.filled) {
			polygon.fill(context);
		}
	};

	const drawPolygons = (context: CanvasRenderingContext2D) => {
		polygons.forEach((polygon) => drawPolygon(context, polygon));
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
		drawPolygon(context, polygon);

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
		canvas.style.cursor = "pointer";
		setToolMode("edit");
	};
	const stopEditing = (canvas: HTMLCanvasElement, mode: string) => {
		canvas.style.cursor = "crosshair";
		setToolMode(mode);
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
