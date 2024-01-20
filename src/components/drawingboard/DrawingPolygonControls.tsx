import {
	AutoFixHigh,
	ModeEdit,
	PanToolAlt,
	Rotate90DegreesCcw,
} from "@mui/icons-material";
import {
	Button,
	Checkbox,
	FormControlLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import { VFC } from "react";
import styles from "./DrawingControls.module.css";

type Props = {
	color: string;
	fillColor: string;
	side: number;
	startAngle: number;
	toolMode: string;
	eraserWidth: number;
	eraserShape: string;
	fill: boolean;
	guidewires: boolean;
	setColor: (color: string) => void;
	setFillColor: (color: string) => void;
	setSide: (side: number) => void;
	setStartAngle: (startAngle: number) => void;
	setToolMode: (startAngle: string) => void;
	setEraserWidth: (startAngle: number) => void;
	setEraserShape: (eraserShape: string) => void;
	setFill: (fill: boolean) => void;
	setGuidewires: (guidewires: boolean) => void;
	eraseLines: () => void;
};

export const DrawingPolygonControls: VFC<Props> = (props: Props) => {
	const {
		color,
		fillColor,
		side,
		startAngle,
		toolMode,
		eraserWidth,
		eraserShape,
		fill,
		guidewires,
		setColor,
		setFillColor,
		setSide,
		setStartAngle,
		setToolMode,
		setEraserWidth,
		setEraserShape,
		setFill,
		setGuidewires,
		eraseLines,
	} = props;
	const colors = [
		"yellow",
		"red",
		"green",
		"blue",
		"orange",
		"cornflowerblue",
		"goldenrod",
		"navy",
		"purple",
	];
	const sides = [3, 4, 6, 8, 10, 12, 20, 30];
	const startAngles = [0, 22.5, 45, 67.5, 90];
	const fillColors = [
		{ color: "yellow", value: "yellow" },
		{ color: "semi-transparent red", value: "rgba(255,0,0,0.5)" },
		{ color: "green", value: "green" },
		{ color: "semi-transparent blue", value: "rgba(0,0,255,0.5)" },
		{ color: "orange", value: "orange" },
		{ color: "cornflowerblue", value: "rgba(100,140,230,0.5)" },
		{ color: "goldenrod", value: "goldenrod" },
		{ color: "navy", value: "navy" },
		{ color: "purple", value: "purple" },
	];
	const eraserWidths = [5, 10, 25, 50, 75, 100, 125, 150, 175, 200];
	const eraserShapes = ["circle", "square"];

	const handleColorChange = (event: SelectChangeEvent<string>) => {
		setColor(event.target.value);
	};

	const handleFillColorChange = (event: SelectChangeEvent<string>) => {
		setFillColor(event.target.value);
	};

	const handleSideChange = (event: SelectChangeEvent<number>) => {
		setSide(Number(event.target.value));
	};

	const handleStartAngleChange = (event: SelectChangeEvent<number>) => {
		setStartAngle(Number(event.target.value));
	};

	const handleEraserWidthChange = (event: SelectChangeEvent<number>) => {
		setEraserWidth(Number(event.target.value));
	};

	const handleEraserShapeChange = (event: SelectChangeEvent<string>) => {
		setEraserShape(event.target.value);
	};

	const handleFillChange = () => {
		setFill(!fill);
	};

	const handleGuidewiresChange = () => {
		setGuidewires(!guidewires);
	};

	const handleToolModeChange = (
		event: React.MouseEvent<HTMLElement>,
		toolMode: string
	) => {
		if (toolMode) setToolMode(toolMode);
	};

	return (
		<>
			<Stack
				direction="row"
				alignItems="center"
				spacing={2}
				className={styles.controls}
			>
				<Typography paddingLeft="10px">Stroke Color:</Typography>
				<Select
					value={color}
					onChange={handleColorChange}
					displayEmpty
					inputProps={{ "aria-label": "Without label" }}
				>
					{colors.map((color) => (
						<MenuItem key={color} value={color}>
							{color}
						</MenuItem>
					))}
				</Select>
				<Typography paddingLeft="10px">Fill Color:</Typography>
				<Select
					value={fillColor}
					onChange={handleFillColorChange}
					displayEmpty
					inputProps={{ "aria-label": "Without label" }}
				>
					{fillColors.map((color) => (
						<MenuItem key={color.color} value={color.value}>
							{color.color}
						</MenuItem>
					))}
				</Select>
				<Typography paddingLeft="10px">Sides:</Typography>
				<Select
					value={side}
					onChange={handleSideChange}
					displayEmpty
					inputProps={{ "aria-label": "Without label" }}
				>
					{sides.map((side) => (
						<MenuItem key={side} value={side}>
							{side}
						</MenuItem>
					))}
				</Select>
				<Typography paddingLeft="10px">StartAngle:</Typography>
				<Select
					value={startAngle}
					onChange={handleStartAngleChange}
					displayEmpty
					inputProps={{ "aria-label": "Without label" }}
				>
					{startAngles.map((startAngle) => (
						<MenuItem key={startAngle} value={startAngle}>
							{startAngle}
						</MenuItem>
					))}
				</Select>
				<FormControlLabel
					control={<Checkbox value={fill} onChange={handleFillChange} />}
					label="Fill:"
					labelPlacement="start"
				/>
				<FormControlLabel
					control={
						<Checkbox value={guidewires} onChange={handleGuidewiresChange} />
					}
					label="Guidewires:"
					labelPlacement="start"
				/>
				<Button variant="outlined" onClick={() => eraseLines()}>
					Erase All
				</Button>
			</Stack>
			<Stack
				direction="row"
				alignItems="center"
				spacing={2}
				className={styles.controls2}
			>
				<Typography paddingLeft="10px">Eraser Width:</Typography>
				<Select
					value={eraserWidth}
					onChange={handleEraserWidthChange}
					displayEmpty
					inputProps={{ "aria-label": "Without label" }}
				>
					{eraserWidths.map((eraserWidth) => (
						<MenuItem key={eraserWidth} value={eraserWidth}>
							{eraserWidth}
						</MenuItem>
					))}
				</Select>
				<Typography paddingLeft="10px">Eraser Shape:</Typography>
				<Select
					value={eraserShape}
					onChange={handleEraserShapeChange}
					displayEmpty
					inputProps={{ "aria-label": "Without label" }}
				>
					{eraserShapes.map((eraserShape) => (
						<MenuItem key={eraserShape} value={eraserShape}>
							{eraserShape}
						</MenuItem>
					))}
				</Select>
				<ToggleButtonGroup
					value={toolMode}
					exclusive
					defaultValue="draw"
					onChange={handleToolModeChange}
				>
					<ToggleButton value="draw" aria-label="draw">
						<ModeEdit />
					</ToggleButton>
					<ToggleButton value="edit" aria-label="edit">
						<PanToolAlt />
					</ToggleButton>
					<ToggleButton value="rotate" aria-label="edit">
						<Rotate90DegreesCcw />
					</ToggleButton>
					<ToggleButton value="erase" aria-label="erase">
						<AutoFixHigh />
					</ToggleButton>
				</ToggleButtonGroup>
			</Stack>
		</>
	);
};

export default DrawingPolygonControls;
