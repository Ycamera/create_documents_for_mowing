import React from "react";
import { Box } from "@chakra-ui/react";

type LoadingBgProps = { turnBgIntoDark: boolean };

const LoadingBg: React.FC<LoadingBgProps> = ({ turnBgIntoDark }) => {
	return (
		<Box
			pos="fixed"
			w="100%"
			height="100vh"
			bg={turnBgIntoDark ? "gray.400" : "trasparent"}
			top="0"
			zIndex="100"
			opacity="0.2"
			transition="1s"
			pointerEvents="none"
		/>
	);
};

export default LoadingBg;
