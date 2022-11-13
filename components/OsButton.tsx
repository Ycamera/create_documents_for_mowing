import React from "react";

import { Box, Grid } from "@chakra-ui/react";

const OsButton: React.FC<{ os: "windows" | "mac"; toggleOs: any }> = ({ os, toggleOs }) => {
	return (
		<Grid
			templateColumns="repeat(2,1fr)"
			onClick={toggleOs}
			w="100%"
			maxW="10rem"
			mt="2rem"
			ml="auto"
			pos="relative"
			cursor="pointer"
			color="gray.600"
			_before={{
				content: "''",
				pos: "absolute",
				border: "0.1rem solid",
				borderColor: "gray.400",
				left: os === "windows" ? 0 : "50%",
				top: 0,
				w: "50%",
				h: "100%",
				zIndex: -1,
				borderRadius: "0.2rem",
				transition: "0.2s",
				boxShadow: "inset 0.05rem 0.05rem 0.3rem gray",
				opacity: 0.5,
			}}
		>
			<Box textAlign="center">Windows</Box>
			<Box textAlign="center">Mac</Box>
		</Grid>
	);
};

export default OsButton;
