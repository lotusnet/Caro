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

export const windowToCanvas = (
	canvas: HTMLCanvasElement,
	x: number,
	y: number
): Point => {
	var bbox = canvas.getBoundingClientRect();
	return {
		x: (x - bbox.left) * (canvas.width / bbox.width),
		y: y - bbox.top + canvas.height / bbox.height,
	};
};

// 描画サーフェイスの保存と復元
export const saveDrawingSurface = (context: CanvasRenderingContext2D) => {
	const canvas = context.canvas;
	if (!context) return undefined;
	return context.getImageData(0, 0, canvas.width, canvas.height);
};
export const restoreDrawingSurface = (
	context: CanvasRenderingContext2D,
	drawingSurfaceImageData: ImageData | undefined
) => {
	if (!context) return;
	if (!drawingSurfaceImageData) return;
	context.putImageData(drawingSurfaceImageData, 0, 0);
};
