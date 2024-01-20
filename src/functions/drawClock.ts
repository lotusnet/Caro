const FONT_HEIGHT = 15;
const MARGIN = 35;
const NUMERAL_SPACING = 20;

export const drawClock = (canvas: HTMLCanvasElement) => {
	const handTrancation = canvas.width / 25;
	const hourHandTrancation = canvas.width / 10;
	const width = canvas.width;
	const height = canvas.height;
	const halfWidth = width / 2;
	const halfHeight = height / 2;
	const radius = halfWidth - MARGIN;
	const handRadius = radius + NUMERAL_SPACING;

	const context = canvas.getContext("2d");

	const drawCircle = () => {
		context?.beginPath();
		context?.arc(halfWidth, halfHeight, radius, 0, Math.PI * 2, true);
		context?.stroke();
	};

	const drawNumerals = () => {
		[...Array(12)]
			.map((_, i) => i + 1)
			.forEach((i) => {
				const angle = (Math.PI / 6) * (i - 3);
				const numeral = i.toString();
				const numeralWidth = context?.measureText(numeral).width ?? 0;
				const x = halfWidth + Math.cos(angle) * handRadius - numeralWidth / 2;
				const y = halfHeight + Math.sin(angle) * handRadius + FONT_HEIGHT / 3;
				context?.fillText(numeral, x, y);
			});
	};

	const drawHands = () => {
		let date = new Date(),
			hour = date.getHours();
		hour = hour > 12 ? hour - 12 : hour;
		drawHand(hour * 5 + (date.getMinutes() / 60) * 5, true);
		drawHand(date.getMinutes(), false);
		drawHand(date.getSeconds(), false);
	};

	const drawCenter = () => {
		context?.beginPath();
		context?.arc(halfWidth, halfHeight, 5, 0, Math.PI * 2, true);
		context?.fill();
	};

	const drawClockCore = () => {
		context?.clearRect(0, 0, width, height);
		drawCircle();
		drawCenter();
		drawHands();
		drawNumerals();
	};

	const drawHand = (loc: number, isHour: boolean) => {
		let angle = Math.PI * 2 * (loc / 60) - Math.PI / 2,
			handRadius = isHour
				? radius - handTrancation - hourHandTrancation
				: radius - handTrancation;
		context?.moveTo(halfWidth, halfHeight);
		context?.lineTo(
			halfWidth + Math.cos(angle) * handRadius,
			halfHeight + Math.sin(angle) * handRadius
		);
		context?.stroke();
	};

	return drawClockCore();
};
