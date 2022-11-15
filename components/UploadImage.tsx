import React, { useContext } from "react";

import { Box, Text, Image, Grid } from "@chakra-ui/react";
import { ImageKeyProps, FormInfoContextProps, typeOfPlaceContextsProps } from "./type/type";
import { formInfoContext, typeOfPlaceContexts, useFormContext } from "../pages/index";

import ErrorMessage from "./ErrorMessage";

type UploadImageProps = {
	title: string;
	imageKey: ImageKeyProps;
};

const UploadImage: React.FC<UploadImageProps> = ({ title, imageKey }) => {
	const { register, errors } = useContext(useFormContext);
	const { images, imageChangeHandler } = useContext(formInfoContext) as FormInfoContextProps;
	const image = images[imageKey];

	function onClickFocusInput(e: any) {
		const inputElement = document.getElementById(imageKey) as HTMLInputElement;
		if (e.target.tagName !== "INPUT") {
			inputElement.click();
		}
	}

	return (
		<Box w="100%">
			<Box
				w="100%"
				boxShadow="0 0 0.3rem gray"
				borderRadius="0.3rem"
				// overflow="hidden"
				onClick={onClickFocusInput}
				cursor="pointer"
				transition="0.1s"
				_hover={{ boxShadow: "0 0.1rem 0.5rem gray" }}
				_active={{ boxShadow: "inset 0 0.1rem 0.3rem gray" }}
			>
				<Text fontSize="1.2rem" textAlign="center" bg="gray.200" py="0.5rem" zIndex="-1" pos="relative">
					{title}
				</Text>
				{image && (
					<Image
						w="calc(100% - 2rem)"
						src={image}
						objectFit="contain"
						mt="1rem"
						mx="auto"
						p="0.5rem"
						boxShadow="0 0 0.2rem gray"
						borderRadius="0.3rem"
					/>
				)}
				<Box overflow="hidden">
					<input
						id={imageKey}
						{...register(imageKey, {
							required: "必須項目",
							onChange: (e: any) => imageChangeHandler(e, imageKey),
						})}
						type="file"
						accept="image/*"
						style={{ boxSizing: "content-box", margin: "1rem 1rem", width: "100%" }}
						className="construct-image"
					/>
				</Box>
			</Box>
			<ErrorMessage error={errors[imageKey]?.message} />
		</Box>
	);
};

export const UploadImagesForSchool: React.FC = () => {
	return (
		<Grid templateColumns={{ base: "repeat(1,1fr)", md: "repeat(2,1fr)" }} gap="2rem" mt="1.5rem" w="100%">
			<UploadImage title="着工前写真" imageKey="beforeConstruct" />
			<UploadImage title="着工後写真" imageKey="afterConstruct" />
		</Grid>
	);
};

export const UploadImagesForPark: React.FC = () => {
	const { typeOfPicture } = useContext(typeOfPlaceContexts) as typeOfPlaceContextsProps;
	const titleObj = { beforeConstruct: "作業前写真", afterConstruct: "作業後写真" };
	const title = titleObj[typeOfPicture] as "作業前写真" | "作業後写真";

	const imageKeys: ("firstImage" | "secondImage" | "thirdImage")[] = ["firstImage", "secondImage", "thirdImage"];

	return (
		<Grid templateColumns={{ base: "repeat(1,1fr)", md: "repeat(2,1fr)" }} gap="2rem" mt="1.5rem" w="100%">
			{imageKeys.map((imageKey, index) => {
				return <UploadImage key={imageKey} title={title + " No." + (index + 1)} imageKey={imageKey} />;
			})}
		</Grid>
	);
};
