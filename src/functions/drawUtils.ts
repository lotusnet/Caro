import { Point, Polygon, Rect } from "models/Polygon";

const CENTROID_RADIUS = 10;
const CENTROID_STROKE_STYLE = "rgba(0,0,0,0.5)";
const CENTROID_FILL_STYLE = "rgba(80,190,240,0.6)";
const CENTROID_SHADOW_COLOR = "rgba(255, 255, 255, 0.4)";
const TRACKING_RING_MARGIN = 55;
const DEGREE_RING_MARGIN = 35;
const DEGREE_OUTER_RING_MARGIN = DEGREE_RING_MARGIN;
const DEGREE_ANNOTATIONS_FILL_STYLE = "rgba(0, 0, 230, 0.8)";
const TICK_WIDTH = 10;
const DEGREE_ANNOTATIONS_TEXT_SIZE = 11;
const TICK_LONG_STROKE_STYLE = "rgba(100, 140, 230, 0.9)";
const TICK_SHORT_STROKE_STYLE = "rgba(100, 140, 230, 0.7)";
const TRACKING_RING_STROKING_STYLE = "rgba(100, 140, 230, 0.3)";

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
	let bbox = canvas.getBoundingClientRect();
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
	if (!context) return null;
	const canvas = context.canvas;
	context.save();
	context.clearRect(0, 0, canvas.width, canvas.height);
	if (draw) draw(canvas);
	const drawingSurfaceImageData = saveDrawingSurface(context);
	context.restore();
	return drawingSurfaceImageData;
};

/**
 * 回転ダイアルの中心点を描画します。
 * @param context CanvasRenderingContext2Dオブジェクト
 * @param point 中心点(重心)
 * @returns なし
 */
export const drawCentroid = (
	context: CanvasRenderingContext2D,
	point: Point
) => {
	if (!context) return;
	context.beginPath();
	context.save();
	context.strokeStyle = CENTROID_STROKE_STYLE;
	context.fillStyle = CENTROID_FILL_STYLE;
	context.shadowColor = CENTROID_SHADOW_COLOR;
	context.arc(point.x, point.y, CENTROID_RADIUS, 0, Math.PI * 2, false);
	context.stroke();
	context.fill();
	context.restore();
};

/**
 * 回転ダイアルの回転芯を描画します。
 * @param context CanvasRenderingContext2Dオブジェクト
 * @param loc マウスの位置
 * @param polygon 回転対象のポリゴン
 * @param rotatingLockAngle 回転角度
 * @returns なし
 */
export const drawCentroidGuidewire = (
	context: CanvasRenderingContext2D,
	loc: Point,
	polygon: Polygon,
	rotatingLockAngle: number
) => {
	if (!context) return;
	let angle = Math.atan((loc.y - polygon.centerY) / (loc.x - polygon.centerX));
	let endpt: Point;

	const radius = polygon.radius + TRACKING_RING_MARGIN;
	angle = angle - rotatingLockAngle;

	if (loc.x >= polygon.centerX) {
		endpt = {
			x: polygon.centerX + radius * Math.cos(angle),
			y: polygon.centerY + radius * Math.sin(angle),
		};
	} else {
		endpt = {
			x: polygon.centerX - radius * Math.cos(angle),
			y: polygon.centerY - radius * Math.sin(angle),
		};
	}

	context.save();
	context.beginPath();
	context.moveTo(polygon.centerX, polygon.centerY);
	context.lineTo(endpt.x, endpt.y);
	context.stroke();

	context.beginPath();
	context.arc(endpt.x, endpt.y, 5, 0, Math.PI * 2, false);
	context.stroke();
	context.fill();

	context.restore();
};

/**
 * 回転ダイアルの外枠を描画します。
 * @param context CanvasRenderingContext2Dオブジェクト
 * @param polygon 回転対象のポリゴン
 * @returns なし
 */
export const drawDegreeOuterDial = (
	context: CanvasRenderingContext2D,
	polygon: Polygon
) => {
	if (!context) return;
	context.strokeStyle = "rgba(0, 0, 0, 0.1)";
	context.arc(
		polygon.centerX,
		polygon.centerY,
		polygon.radius + DEGREE_OUTER_RING_MARGIN,
		0,
		Math.PI * 2,
		true
	);
};

/**
 * 回転ダイアルの回転目盛りのテキストを描画します。
 * @param context CanvasRenderingContext2Dオブジェクト
 * @param polygon 回転対象のポリゴン
 * @returns なし
 */
export const drawDegreeAnnotations = (
	context: CanvasRenderingContext2D,
	polygon: Polygon
) => {
	if (!context) return;
	const radius = polygon.radius + DEGREE_RING_MARGIN;

	context.save();
	context.fillStyle = DEGREE_ANNOTATIONS_FILL_STYLE;
	context.font = DEGREE_ANNOTATIONS_TEXT_SIZE + "px Helvetica";

	for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 8) {
		context.beginPath();
		context.fillText(
			((angle * 180) / Math.PI).toFixed(0),
			polygon.centerX + Math.cos(angle) * (radius - TICK_WIDTH * 2),
			polygon.centerY + Math.sin(angle) * (radius - TICK_WIDTH * 2)
		);
	}
	context.restore();
};

/**
 * 回転ダイアルの回転目盛りを描画します。
 * @param context CanvasRenderingContext2Dオブジェクト
 * @param polygon 回転対象のポリゴン
 * @returns なし
 */
export const drawDegreeDialTicks = (
	context: CanvasRenderingContext2D,
	polygon: Polygon
) => {
	if (!context) return;
	var radius = polygon.radius + DEGREE_RING_MARGIN,
		ANGLE_MAX = 2 * Math.PI,
		ANGLE_DELTA = Math.PI / 64;

	context.save();

	for (let angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, ++cnt) {
		context.beginPath();

		if (cnt % 4 === 0) {
			context.moveTo(
				polygon.centerX + Math.cos(angle) * (radius - TICK_WIDTH),
				polygon.centerY + Math.sin(angle) * (radius - TICK_WIDTH)
			);
			context.lineTo(
				polygon.centerX + Math.cos(angle) * radius,
				polygon.centerY + Math.sin(angle) * radius
			);
			context.strokeStyle = TICK_LONG_STROKE_STYLE;
			context.stroke();
		} else {
			context.moveTo(
				polygon.centerX + Math.cos(angle) * (radius - TICK_WIDTH / 2),
				polygon.centerY + Math.sin(angle) * (radius - TICK_WIDTH / 2)
			);
			context.lineTo(
				polygon.centerX + Math.cos(angle) * radius,
				polygon.centerY + Math.sin(angle) * radius
			);
			context.strokeStyle = TICK_SHORT_STROKE_STYLE;
			context.stroke();
		}

		context.restore();
	}
};

export const drawDegreeTickDial = (
	context: CanvasRenderingContext2D,
	polygon: Polygon
) => {
	if (!context) return;
	context.save();
	context.strokeStyle = "rgba(0, 0, 0, 0.1)";
	context.beginPath();
	context.arc(
		polygon.centerX,
		polygon.centerY,
		polygon.radius + DEGREE_RING_MARGIN - TICK_WIDTH,
		0,
		Math.PI * 2,
		false
	);
	context.stroke();
	context.restore();
};

export const drawTrackingDial = (
	context: CanvasRenderingContext2D,
	polygon: Polygon
) => {
	if (!context) return;
	context.save();
	context.shadowColor = "rgba(0, 0, 0, 0.7)";
	(context.shadowOffsetX = 3),
		(context.shadowOffsetY = 3),
		(context.shadowBlur = 6),
		(context.strokeStyle = TRACKING_RING_STROKING_STYLE);
	context.beginPath();
	context.arc(
		polygon.centerX,
		polygon.centerY,
		polygon.radius + TRACKING_RING_MARGIN,
		0,
		Math.PI * 2,
		false
	);
	context.stroke();
	context.restore();
};
