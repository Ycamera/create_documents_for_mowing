import React, { useContext, useEffect } from "react";
import { Box, Input, FormControl, FormLabel } from "@chakra-ui/react";

import { useFormContext } from "../pages/index";
import ErrorMessage from "./ErrorMessage";

type CommonFormProps = {
	label: string;
	onChange: any;
	value: string | number;
	name: string;
	id: "place" | "number" | "time";
	nextInputId?: "number" | "time";
	required?: boolean;
};

const CommonForm: React.FC<CommonFormProps> = ({ label, onChange, value, name, id, nextInputId, required }) => {
	const { register, errors } = useContext(useFormContext);

	function onKeyPressEnter(e: any) {
		if (e.key === "Enter" && nextInputId) {
			const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
			nextInput.focus();
		}
	}

	let registerInfo;

	if (required) {
		registerInfo = {
			...register(name, {
				required: "必須項目",
				onChange: onChange,
			}),
		};
	} else {
		registerInfo = {
			...register(name, {
				onChange: onChange,
			}),
		};
	}

	return (
		<FormControl mt={{ base: "0.5rem", sm: "1rem" }}>
			<FormLabel fontSize="1.2rem">{label}</FormLabel>
			<Input
				id={id}
				{...registerInfo}
				type="text"
				value={value}
				borderColor="gray.300"
				onKeyPress={onKeyPressEnter}
			/>
			<ErrorMessage error={errors[name]?.message} />
		</FormControl>
	);
};

export default CommonForm;
