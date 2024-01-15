import { Stack } from "@mui/material";
import { drawCentroidGuidwire, drawDial } from "functions/drawDial";
import { drawGrid } from "functions/drawGrid";
import {
	drawGuidewires,
	erase,
	getRubberBandRectangle,
	restoreDrawingSurface,
	saveDrawingSurface,
	windowToCanvas,
} from "functions/drawUtils";
import { Point, Rect } from "models/Polygon";
import { VFC, useEffect, useRef, useState } from "react";
import styles from "./DrawingLine.module.css";
import DrawingLineControls from "./DrawingLineControls";

type Props = {
	content: string;
};

export const DrawingLine: VFC<Props> = (props: Props) => {
	const { content } = props;
	const canvasRef = useRef(null);
	const radius = 150;
	let drawingSurfaceImageData: ImageData | null;
	let rubberBandRect: Rect = { left: 0, top: 0, width: 0, height: 0 };
	let mouseDown: Point = { x: 0, y: 0 };
	let dragging: boolean;

	const [color, setColor] = useState("red");
	const [guidewires, setGuidewires] = useState(false);

	const getContext = (): CanvasRenderingContext2D => {
		const canvas: any = canvasRef.current;
		return canvas?.getContext("2d");
	};

	useEffect(() => {
		const context = getContext();
		if (!context) return;
		const canvas = context.canvas;
		drawGrid(canvas, "lightgrey", 10, 10);
		context.strokeStyle = color;

		context.save();
		if (content === "dial") {
			drawDial(canvas, radius);
		}
		context.restore();
	});

	const drawRubberbandShape = (loc: Point) => {
		const context = getContext();
		context.beginPath();
		context.moveTo(mouseDown.x, mouseDown.y);
		context.lineTo(loc.x, loc.y);
		context.stroke();
	};
	const updateRubberband = (loc: Point) => {
		rubberBandRect = getRubberBandRectangle(loc, mouseDown);
		drawRubberbandShape(loc);
	};

	// drawLineのイベントハンドラー
	const handleOnMousedownGridline = (e: MouseEvent) => {
		const canvas: any = canvasRef.current;
		if (!canvas) return;
		const loc = windowToCanvas(canvas, e.clientX, e.clientY);
		e.preventDefault();

		drawingSurfaceImageData = saveDrawingSurface(getContext());
		mouseDown.x = loc.x;
		mouseDown.y = loc.y;
		dragging = true;
	};

	const handleOnMousemoveGridline = (e: MouseEvent) => {
		const canvas: any = canvasRef.current;
		if (!canvas) return;

		if (dragging) {
			e.preventDefault();
			const loc = windowToCanvas(canvas, e.clientX, e.clientY);
			const context = getContext();
			restoreDrawingSurface(context, drawingSurfaceImageData);
			updateRubberband(loc);
			if (guidewires) {
				drawGuidewires(context, loc);
			}
		}
	};

	const handleOnMouseupGridline = (e: MouseEvent) => {
		const canvas: any = canvasRef.current;
		if (!canvas) return;

		const loc = windowToCanvas(canvas, e.clientX, e.clientY);
		restoreDrawingSurface(getContext(), drawingSurfaceImageData);
		updateRubberband(loc);
		dragging = false;
	};

	// drawDialのイベントハンドラー
	const handleOnMousedownDial = (e: MouseEvent) => {
		const canvas: any = canvasRef.current;
		if (!canvas) return;
		const loc = windowToCanvas(canvas, e.clientX, e.clientY);
		e.preventDefault();
		drawingSurfaceImageData = saveDrawingSurface(getContext());
		mouseDown.x = loc.x;
		mouseDown.y = loc.y;
		dragging = true;
	};

	const handleOnMousemoveDial = (e: MouseEvent) => {
		const canvas: any = canvasRef.current;
		if (!canvas) return;
		if (dragging) {
			e.preventDefault();

			const context = getContext();
			erase(context, (canvas) => {
				drawGrid(canvas, "lightgray", 10, 10);
				drawDial(canvas, radius);
			});

			restoreDrawingSurface(context, drawingSurfaceImageData);
			drawCentroidGuidwire(
				context,
				calcCircumferencePoint(
					windowToCanvas(canvas, e.clientX, e.clientY),
					{ x: canvas.width / 2, y: canvas.height / 2 },
					radius
				)
			);
		}
	};

	const calcCircumferencePoint = (p: Point, cp: Point, r: number): Point => {
		const p2 = { x: p.x - cp.x, y: p.y - cp.y };
		const ratio = r / Math.sqrt(Math.pow(p2.x, 2) + Math.pow(p2.y, 2));
		//return { x: cp.x + p.x * ratio, y: cp.y + p.y * ratio };
		return p;
	};

	const handleOnMouseupDial = (e: MouseEvent) => {
		const canvas: any = canvasRef.current;
		if (!canvas) return;

		const context = getContext();
		erase(context, (canvas) => {
			drawGrid(canvas, "lightgray", 10, 10);
			drawDial(canvas, radius);
		});

		restoreDrawingSurface(context, drawingSurfaceImageData);
		drawCentroidGuidwire(
			context,
			calcCircumferencePoint(
				windowToCanvas(canvas, e.clientX, e.clientY),
				{ x: canvas.width / 2, y: canvas.height / 2 },
				radius
			)
		);
		dragging = false;
	};

	const eraseLines = () => {
		erase(getContext(), (canvas) => drawGrid(canvas, "lightgray", 10, 10));
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
					width={500}
					height={500}
					className={styles.canvas}
					ref={canvasRef}
					onMouseDown={(e) => {
						if (content === "drawLine")
							handleOnMousedownGridline(e.nativeEvent);
						else handleOnMousedownDial(e.nativeEvent);
					}}
					onMouseMove={(e) => {
						if (content === "drawLine")
							handleOnMousemoveGridline(e.nativeEvent);
						else handleOnMousemoveDial(e.nativeEvent);
					}}
					onMouseUp={(e) => {
						if (content === "drawLine") handleOnMouseupGridline(e.nativeEvent);
						else handleOnMouseupDial(e.nativeEvent);
					}}
				>
					Canvas not supported.
				</canvas>
				{content === "drawLine" ? (
					<DrawingLineControls
						color={color}
						guidewires={guidewires}
						setColor={setColor}
						setGuidewires={setGuidewires}
						eraseLines={eraseLines}
					/>
				) : null}
			</Stack>
		</>
	);
};

export default DrawingLine;
