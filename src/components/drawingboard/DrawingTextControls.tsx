import {
	FormatColorFill,
	FormatColorText,
	HighlightAlt,
} from "@mui/icons-material";
import {
	Stack,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
} from "@mui/material";
import { VFC, useState } from "react";
import styles from "./DrawingControls.module.css";

type Props = {
	text: string;
	setText: (text: string) => void;
	setStroke: (stroke: boolean) => void;
	setFill: (fill: boolean) => void;
	setShadow: (shadow: boolean) => void;
};

export const DrawingTextControls: VFC<Props> = (props: Props) => {
	const { text, setText, setStroke, setFill, setShadow } = props;
	const [formats, setFormats] = useState(() => ["bold", "italic"]);

	const handleFormat = (
		event: React.MouseEvent<HTMLElement>,
		newFormats: string[]
	) => {
		setFormats(newFormats);
		setStroke(newFormats.includes("stroke"));
		setFill(newFormats.includes("fill"));
		setShadow(newFormats.includes("shadow"));
	};

	return (
		<>
			<Stack
				direction="row"
				alignItems="center"
				spacing={2}
				className={styles.controls}
			>
				<ToggleButtonGroup
					value={formats}
					onChange={handleFormat}
					aria-label="text formatting"
				>
					<ToggleButton value="stroke" aria-label="bold">
						<FormatColorText />
					</ToggleButton>
					<ToggleButton value="fill" aria-label="italic">
						<FormatColorFill />
					</ToggleButton>
					<ToggleButton value="shadow" aria-label="underlined">
						<HighlightAlt />
					</ToggleButton>
				</ToggleButtonGroup>
				<TextField
					id="outlined-basic"
					label="input text"
					variant="outlined"
					value={text}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setText(event.target.value);
					}}
				/>
			</Stack>
		</>
	);
};

export default DrawingTextControls;
