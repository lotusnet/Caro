import {
	Button,
	Checkbox,
	FormControlLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	Typography,
} from "@mui/material";
import { VFC } from "react";
import styles from "./DrawingControls.module.css";

type Props = {
	color: string;
	fillColor: string;
	side: number;
	startAngle: number;
	fill: boolean;
	edit: boolean;
	guidewires: boolean;
	setColor: (color: string) => void;
	setFillColor: (color: string) => void;
	setSide: (side: number) => void;
	setStartAngle: (startAngle: number) => void;
	setFill: (fill: boolean) => void;
	setEdit: (edit: boolean) => void;
	setGuidewires: (guidewires: boolean) => void;
	eraseLines: () => void;
};

export const DrawingPolygonControls: VFC<Props> = (props: Props) => {
	const {
		color,
		fillColor,
		side,
		startAngle,
		fill,
		edit,
		guidewires,
		setColor,
		setFillColor,
		setSide,
		setStartAngle,
		setFill,
		setEdit,
		setGuidewires,
		eraseLines,
	} = props;
	const colors = [
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
		{ color: "semi-transparent red", value: "rgba(255,0,0,0.5)" },
		{ color: "green", value: "green" },
		{ color: "semi-transparent blue", value: "rgba(0,0,255,0.5)" },
		{ color: "orange", value: "orange" },
		{ color: "cornflowerblue", value: "rgba(100,140,230,0.5)" },
		{ color: "goldenrod", value: "goldenrod" },
		{ color: "navy", value: "navy" },
		{ color: "purple", value: "purple" },
	];

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

	const handleFillChange = () => {
		setFill(!fill);
	};

	const handleEditChange = () => {
		setEdit(!edit);
	};

	const handleGuidewiresChange = () => {
		setGuidewires(!guidewires);
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
					control={<Checkbox value={edit} onChange={handleEditChange} />}
					label="Edit:"
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
		</>
	);
};

export default DrawingPolygonControls;
