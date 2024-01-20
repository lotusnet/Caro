import { drawClock } from "functions/drawClock";
import { drawGrid } from "functions/drawGrid";
import { VFC, useEffect, useRef } from "react";
import styles from "./Drawing.module.css";
import DrawingLine from "./DrawingLine";
import DrawingPolygon from "./DrawingPolygon";
import DrawingText from "./DrawingText";

type Props = {
	content: string;
};

export const DrawingBoard: VFC<Props> = (props: Props) => {
	const { content } = props;
	const canvasRef = useRef(null);
	const getContext = (): CanvasRenderingContext2D => {
		const canvas: any = canvasRef.current;
		return canvas?.getContext("2d");
	};

	const drawMessage = (message: string) => {
		const canvas: any = canvasRef.current;
		const context = getContext();
		context.font = "38pt Arial";
		context.fillStyle = "gold";
		context.strokeStyle = "cornflowerblue";
		context.fillText(message, canvas.width / 2 - 150, canvas.height / 2 + 15);
		context.strokeText(message, canvas.width / 2 - 150, canvas.height / 2 + 15);
	};

	useEffect(() => {
		const ctx = getContext();
		if (!ctx) return;

		ctx.fillRect(0, 0, 100, 100);
		ctx.save();

		drawMessage("Hello Drawing Board!!");

		ctx.font = 15 + "px Arial";

		ctx.clearRect(0, 0, 500, 500);

		if (content === "clock") {
			const interval = setInterval(() => {
				const canvas = canvasRef.current;
				if (canvas) drawClock(canvas);
			}, 1000);
			return () => clearInterval(interval);
		} else if (content === "grid") {
			const canvas = canvasRef.current;
			if (canvas) {
				drawGrid(canvas, "lightgrey", 10, 10);
			}
		}
	});
	const getCanvas = () => {
		if (content === "drawLine" || content === "dial") {
			return <DrawingLine content={content} />;
		} else if (content === "polygon") {
			return <DrawingPolygon />;
		} else if (content === "text") {
			return <DrawingText />;
		}

		return (
			<>
				<canvas
					width={500}
					height={500}
					className={styles.canvas}
					ref={canvasRef}
				>
					Canvas not supported.
				</canvas>
			</>
		);
	};

	return <>{getCanvas()}</>;
};

export default DrawingBoard;
