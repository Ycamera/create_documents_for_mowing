import React, { useContext } from "react";

import { Box, Text, Image, Grid } from "@chakra-ui/react";
import { ImageProps, ImageChangeHandlerProps, ImageKeyProps } from "./type/type";
import { useFormContext } from "../pages/index";

import ErrorMessage from "./ErrorMessage";

type UploadImageProps = {
	title: string;
	images: ImageProps;
	imageChangeHandler: ImageChangeHandlerProps;
	imageKey: ImageKeyProps;
};

const UploadImage: React.FC<UploadImageProps> = ({ title, images, imageChangeHandler, imageKey }) => {
	const { register, errors } = useContext(useFormContext);

	const image = images[imageKey];

	return (
		<Box w="100%">
			<Box w="100%" boxShadow="0 0 0.3rem gray" borderRadius="0.5rem" overflow="hidden">
				<Text fontSize="1.2rem" textAlign="center" bg="gray.200" py="0.5rem">
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
						borderRadius="0.5rem"
					/>
				)}

				<input
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
			<ErrorMessage error={errors[imageKey]?.message} />
		</Box>
	);
};

type UploadImagesProps = {
	images: ImageProps;
	imageChangeHandler: ImageChangeHandlerProps;
};

const UploadImages: React.FC<UploadImagesProps> = ({ images, imageChangeHandler }) => {
	return (
		<Grid templateColumns={{ base: "repeat(1,1fr)", md: "repeat(2,1fr)" }} gap="2rem" mt="1.5rem" w="100%">
			<UploadImage
				title="着工前写真"
				images={images}
				imageChangeHandler={imageChangeHandler}
				imageKey="beforeConstruct"
			/>
			<UploadImage
				title="着工後写真"
				images={images}
				imageChangeHandler={imageChangeHandler}
				imageKey="afterConstruct"
			/>
		</Grid>
	);
};

export default UploadImages;
