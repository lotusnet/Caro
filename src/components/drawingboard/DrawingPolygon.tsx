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

export const DrawingPolygon: VFC = () => {
	const canvasRef = useRef(null);

	let mouseDown: Point = { x: 0, y: 0 };
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
	const [fill, setFill] = useState(false);
	const [edit, setEdit] = useState(false);
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
		setEdit(true);
	};
	const stopEditing = (canvas: HTMLCanvasElement) => {
		canvas.style.cursor = "crosshair";
		setEdit(false);
	};

	// イベントハンドラー
	const handleOnMousedown = (e: MouseEvent) => {
		const canvas: any = canvasRef.current;
		if (!canvas) return;
		const context = getContext(canvas);
		if (!context) return;

		const loc = windowToCanvas(canvas, e.clientX, e.clientY);
		e.preventDefault();

		if (edit) {
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
		if (edit && draggingPolygon) {
			draggingPolygon.move(loc.x - draggingOffsetX, loc.y - draggingOffsetY);
			context.clearRect(0, 0, canvas.width, canvas.height);
			drawGrid(canvas, "lightgray", 10, 10);
			drawPolygons(context);
		} else {
			if (dragging) {
				restoreDrawingSurface(context, drawingSurfaceImageData);
				updateRubberband(loc);

				if (guidewires) {
					drawGuidewires(context, mouseDown);
				}
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

		if (!edit) {
			restoreDrawingSurface(context, drawingSurfaceImageData);
			updateRubberband(loc);
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

	const handleEditChange = (checked: boolean) => {
		const canvas: any = canvasRef.current;
		if (!canvas) return;
		if (checked) {
			startEditing(canvas);
		} else {
			stopEditing(canvas);
		}
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
					fill={fill}
					edit={edit}
					guidewires={guidewires}
					setColor={setStrokeColor}
					setFillColor={setFillColor}
					setSide={setSides}
					setStartAngle={setStartAngle}
					setFill={setFill}
					setEdit={handleEditChange}
					setGuidewires={setGuidewires}
					eraseLines={eraseLines}
				/>
			</Stack>
		</>
	);
};

export default DrawingPolygon;
