import { MenuItem, Select, Stack, Typography } from "@mui/material";
import { SetStateAction, VFC, useState } from "react";
import DrawingBoard from "~/components/drawingboard/DrawingBoard";
import Layout from "~/components/layout/Layout";

export const Canvas: VFC = () => {
	const [content, setContent] = useState("clock");

	const handleChange = (event: {
		target: { value: SetStateAction<string> };
	}) => {
		setContent(event.target.value);
	};

	return (
		<>
			<Layout title={`Canvas`}>
				<Stack width={"600px"}>
					<h1>Canvas</h1>
					<Stack direction="row" alignItems="center" spacing={2}>
						<Typography paddingLeft="10px">コンテンツ:</Typography>
						<Select
							value={content}
							onChange={handleChange}
							displayEmpty
							inputProps={{ "aria-label": "Without label" }}
						>
							<MenuItem value={"clock"}>Clock</MenuItem>
							<MenuItem value={"grid"}>Grid</MenuItem>
							<MenuItem value={"drawLine"}>DrawLine</MenuItem>
							<MenuItem value={"dial"}>Dial</MenuItem>
							<MenuItem value={"polygon"}>Polygon</MenuItem>
							<MenuItem value={"text"}>Text</MenuItem>
						</Select>
					</Stack>
					<DrawingBoard content={content} />
				</Stack>
			</Layout>
		</>
	);
};

export default Canvas;
