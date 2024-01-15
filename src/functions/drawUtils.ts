import { Point, Rect } from "models/Polygon";

/**
 * ２Dコンテキストを取得します。
 * @param canvas HTMLCanvasElementオブジェクト
 * @returns 2Dコンテキスト
 */
export const getContext = (
	canvas: HTMLCanvasElement | null
): CanvasRenderingContext2D | null => {
	if (!canvas) return null;

	return canvas.getContext("2d");
};

/**
 * マウス座標をキャンバス座標へ変換します。
 * @param canvas HTMLCanvasElementオブジェクト
 * @param x X座標
 * @param y Y座標
 * @returns キャンバス上の座標
 */
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

/**
 * 描画サーフェスを保存します。
 * @param context CanvasRenderingContext2Dオブジェクト
 * @returns 保存されたImageData
 */
export const saveDrawingSurface = (context: CanvasRenderingContext2D) => {
	const canvas = context.canvas;
	if (!context) return null;
	return context.getImageData(0, 0, canvas.width, canvas.height);
};

/**
 * 描画サーフェスを復元します。
 * @param context CanvasRenderingContext2Dオブジェクト
 * @param drawingSurfaceImageData 復元するImageData
 * @returns なし
 */
export const restoreDrawingSurface = (
	context: CanvasRenderingContext2D,
	drawingSurfaceImageData: ImageData | null
) => {
	if (!context) return;
	if (!drawingSurfaceImageData) return;
	context.putImageData(drawingSurfaceImageData, 0, 0);
};

/**
 * ラバーバンドの矩形を取得します。
 * @param loc 現在座標
 * @param mouseDown マウス押下時の座標
 * @returns 現在座標とマウス押下時の座標を対角線とする矩形
 */
export const getRubberBandRectangle = (loc: Point, mouseDown: Point) => {
	let rRect: Rect = { left: 0, top: 0, width: 0, height: 0 };
	rRect.width = Math.abs(loc.x - mouseDown.x);
	rRect.height = Math.abs(loc.y - mouseDown.y);

	if (loc.x > mouseDown.x) {
		rRect.left = mouseDown.x;
	} else {
		rRect.left = loc.x;
	}

	if (loc.y > mouseDown.y) {
		rRect.top = mouseDown.y;
	} else {
		rRect.top = loc.y;
	}
	return rRect;
};

/**
 * ガイド線を描画します。
 * @param context CanvasRenderingContext2Dオブジェクト
 * @param loc ガイド線の座標
 */
export const drawGuidewires = (
	context: CanvasRenderingContext2D,
	loc: Point
) => {
	if (!context) return;
	context.save();
	context.strokeStyle = "rgba(0,0,230,0.4)";
	context.lineWidth = 0.5;

	/**
	 * Y軸のガイド線を描画します。
	 * @param y ガイド線を描画するY座標
	 * @returns なし
	 */
	const drawHorizontalLine = (y: number) => {
		if (!context) return;
		context.beginPath();
		context.moveTo(0, y + 0.5);
		context.lineTo(context.canvas.width, y + 0.5);
		context.stroke();
	};

	/**
	 * X軸のガイド線を描画します。
	 * @param x ガイド線を描画するX座標
	 * @returns なし
	 */
	const drawVerticalLine = (x: number) => {
		if (!context) return;
		context.beginPath();
		context.moveTo(x + 0.5, 0);
		context.lineTo(x + 0.5, context.canvas.height);
		context.stroke();
	};

	drawVerticalLine(loc.x);
	drawHorizontalLine(loc.y);
	context.restore();
};

/**
 * キャンバスをクリアします。
 * @param canvas HTMLCanvasElementオブジェクト
 * @param draw クリア後に描画する関数
 * @returns 描画されたImageData
 */
export const erase = (
	context: CanvasRenderingContext2D,
	draw: (canvas: HTMLCanvasElement) => void
): ImageData | null => {
	const canvas = context.canvas;
	context.save();
	context.clearRect(0, 0, canvas.width, canvas.height);
	if (draw) draw(canvas);
	const drawingSurfaceImageData = saveDrawingSurface(context);
	context.restore();
	return drawingSurfaceImageData;
};
