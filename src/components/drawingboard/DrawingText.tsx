import { Stack } from "@mui/material";
import { VFC, useEffect, useRef, useState } from "react";
import styles from "./Drawing.module.css";
import DrawingTextControls from "./DrawingTextControls";

export const DrawingText: VFC = () => {
	const canvasRef = useRef(null);

	const [stroke, setStroke] = useState(false);
	const [fill, setFill] = useState(false);
	const [shadow, setShadow] = useState(false);
	const [text, setText] = useState("sample Text");

	const getContext = (): CanvasRenderingContext2D => {
		const canvas: any = canvasRef.current;
		return canvas?.getContext("2d");
	};

	useEffect(() => {
		const context = getContext();
		if (!context) return;

		context.font = "128px Palatino";
		context.lineWidth = 1.0;
		context.fillStyle = "cornflowerblue";

		turnShadowsOn();
		draw();

		context.save();
		context.restore();
	});

	const draw = () => {
		const context = getContext();
		if (!context) return;

		const canvas = context.canvas;
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();

		if (shadow) turnShadowsOn();
		else turnShadowsOff();

		drawText();
	};

	const drawBackground = () => {
		const context = getContext();
		if (!context) return;
		// Ruled paper
		const STEP_Y = 12,
			TOP_MARGIN = STEP_Y * 4,
			LEFT_MARGIN = STEP_Y * 3;
		let i = context.canvas.height;

		// Horizontal lines
		context.strokeStyle = "lightgray";
		context.lineWidth = 0.5;

		while (i > TOP_MARGIN) {
			context.beginPath();
			context.moveTo(0, i);
			context.lineTo(context.canvas.width, i);
			context.stroke();
			i -= STEP_Y;
		}

		// Vertical line
		context.strokeStyle = "rgba(100,0,0,0.3)";
		context.lineWidth = 1;

		context.beginPath();
		context.moveTo(LEFT_MARGIN, 0);
		context.lineTo(LEFT_MARGIN, context.canvas.height);
		context.stroke();
	};

	const turnShadowsOn = () => {
		const context = getContext();
		if (!context) return;

		if (navigator.userAgent.indexOf("Opera") === -1) {
			context.shadowColor = "rgba(0, 0, 0, 0.8)";
		}
		context.shadowOffsetX = 5;
		context.shadowOffsetY = 5;
		context.shadowBlur = 10;
	};

	const turnShadowsOff = () => {
		const context = getContext();
		if (!context) return;

		if (navigator.userAgent.indexOf("Opera") === -1) {
			context.shadowColor = "transparent";
		}
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
	};

	const drawText = () => {
		const context = getContext();
		if (!context) return;

		const canvas = context.canvas;
		const TEXT_X = 65,
			TEXT_Y = canvas.height / 2 + 35;

		context.strokeStyle = "blue";

		if (fill) context.fillText(text, TEXT_X, TEXT_Y);
		if (stroke) context.strokeText(text, TEXT_X, TEXT_Y);
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
					width={1000}
					height={500}
					className={styles.canvas}
					ref={canvasRef}
					onMouseDown={(e) => {}}
					onMouseMove={(e) => {}}
					onMouseUp={(e) => {}}
				>
					Canvas not supported.
				</canvas>
				<DrawingTextControls
					text={text}
					setText={setText}
					setStroke={setStroke}
					setFill={setFill}
					setShadow={setShadow}
				/>
			</Stack>
		</>
	);
};

export default DrawingText;
