import {
	Button,
	Checkbox,
	FormControlLabel,
	MenuItem,
	Select,
	Stack,
	Typography,
} from "@mui/material";
import { SetStateAction, SyntheticEvent, VFC } from "react";
import styles from "./DrawingLineControls.module.css";

type Props = {
	color: string;
	guidewires: boolean;
	setColor: (color: string) => void;
	setGuidewires: (guidewires: boolean) => void;
	eraseLines: () => void;
};

export const DrawingLineControls: VFC<Props> = (props: Props) => {
	const { color, guidewires, setColor, setGuidewires, eraseLines } = props;
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

	const handleColorChange = (event: {
		target: { value: SetStateAction<string> };
	}) => {
		setColor(event.target.value.toString());
	};

	function handleGuidewiresChange(_: SyntheticEvent<Element, Event>): void {
		setGuidewires(!guidewires);
	}

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
					onChange={(e) => handleColorChange(e)}
					displayEmpty
					inputProps={{ "aria-label": "Without label" }}
				>
					{colors.map((color) => (
						<MenuItem key={color} value={color}>
							{color}
						</MenuItem>
					))}
				</Select>
				<FormControlLabel
					control={<Checkbox />}
					label="Guidewires:"
					labelPlacement="start"
					value={guidewires}
					onChange={(e) => handleGuidewiresChange(e)}
				/>
				<Button variant="outlined" onClick={() => eraseLines()}>
					Erase All
				</Button>
			</Stack>
		</>
	);
};

export default DrawingLineControls;
