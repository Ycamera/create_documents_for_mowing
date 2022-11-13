import React, { useContext } from "react";
import { Input, FormControl, FormLabel } from "@chakra-ui/react";

import { useFormContext } from "../pages/index";
import ErrorMessage from "./ErrorMessage";

type CommonFormProps = {
	label: string;
	onChange: any;
	value: string | number;
	name: string;
	id: "place" | "number" | "time";
	nextInputId?: "number" | "time";
};

const CommonForm: React.FC<CommonFormProps> = ({ label, onChange, value, name, id, nextInputId }) => {
	const { register, errors } = useContext(useFormContext);

	function onKeyPressEnter(e: any) {
		if (e.key === "Enter" && nextInputId) {
			const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
			nextInput.focus();
		}
	}

	return (
		<FormControl mt={name !== "place" ? { base: "0.5rem", sm: "1rem" } : 0}>
			<FormLabel w="5rem" fontSize="1.2rem">
				{label}
			</FormLabel>
			<Input
				id={id}
				{...register(name, {
					required: "必須項目",
					onChange: onChange,
				})}
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
