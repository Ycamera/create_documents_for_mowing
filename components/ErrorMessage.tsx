import React from "react";
import { Text } from "@chakra-ui/react";

type ErrorMessageProps = { error: any };

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
	return (
		error && (
			<Text textAlign="right" mt="0.3rem" fontSize="0.8rem" color="red">
				*{error}
			</Text>
		)
	);
};

export default ErrorMessage;
