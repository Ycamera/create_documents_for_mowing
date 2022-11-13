import React, { useContext } from "react";
import { Input, FormControl, FormLabel } from "@chakra-ui/react";

import { useFormContext } from "../pages/index";
import ErrorMessage from "./ErrorMessage";

type CommonFormProps = {
	label: string;
	onChange: any;
	value: string | number;
	name: string;
};

const CommonForm: React.FC<CommonFormProps> = ({ label, onChange, value, name }) => {
	const { register, errors } = useContext(useFormContext);

	return (
		<FormControl my={{ base: "0.5rem", sm: "1rem" }}>
			<FormLabel w="5rem" fontSize="1.2rem">
				{label}
			</FormLabel>
			<Input
				{...register(name, {
					required: "必須項目",
					onChange: onChange,
				})}
				type="text"
				value={value}
			/>
			<ErrorMessage error={errors[name]?.message} />
		</FormControl>
	);
};

export default CommonForm;
