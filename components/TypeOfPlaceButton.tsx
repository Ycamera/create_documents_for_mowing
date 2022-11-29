import React, { ReactNode, useContext } from "react";
import { FormLabel, Flex, Box, Grid } from "@chakra-ui/react";
import { typeOfPlaceContextsProps, TypeOfPlaceProps, TypeOfPictureProps } from "../components/type/type";
import { typeOfPlaceContexts } from "../pages";

type ButtonCmpProps = {
	type: "place" | "picture";
	label: "2枚：着工前後" | "3枚：作業前後" | "作業前" | "作業後";
	place?: TypeOfPlaceProps;
	picture?: TypeOfPictureProps;
};

const ButtonCmp: React.FC<ButtonCmpProps> = ({ type, label, place, picture }) => {
	const { typeOfPlace, toggleTypeOfPlace, typeOfPicture, toggleTypeOfPicture } = useContext(
		typeOfPlaceContexts
	) as typeOfPlaceContextsProps;

	function colorBgBorder(placeOrPicture: TypeOfPlaceProps | TypeOfPictureProps) {
		const borderRadius =
			placeOrPicture === "school" || placeOrPicture === "beforeConstruct"
				? "0.3rem 0 0 0.3rem"
				: "0 0.3rem 0.3rem 0";

		if (typeOfPlace === placeOrPicture || typeOfPicture === placeOrPicture)
			return { color: "gray.900", bg: "gray.300", borderRadius };
		return {
			color: "gray.400",
			bg: "gray.100",
			borderRadius,
			_hover: {
				bg: "gray.200",
			},
		};
	}

	const name = place ? place : (picture as TypeOfPlaceProps | TypeOfPictureProps);

	return (
		<Flex
			{...colorBgBorder(name)}
			justifyContent="center"
			alignItems="center"
			transition="0.2s"
			onClick={() => {
				if (type === "place" && typeof place === "string") {
					return toggleTypeOfPlace(place);
				}
				if (type === "picture" && typeof picture === "string") {
					return toggleTypeOfPicture(picture);
				}
			}}
			_active={{ boxShadow: "inset 0 0.1rem 0.3rem gray" }}
		>
			{label}
		</Flex>
	);
};

const ButtonLayout: React.FC<{ children: ReactNode; title: string; style?: object }> = ({ children, title, style }) => {
	return (
		<Box {...(style && style)}>
			<FormLabel fontSize="1.2rem">{title}</FormLabel>
			<Grid
				templateRows="1"
				templateColumns="repeat(2,1fr)"
				fontSize="1.2rem"
				borderRadius="0.3rem"
				boxShadow="0 0 0.3rem gray"
				cursor="pointer"
			>
				{children}
			</Grid>
		</Box>
	);
};

type TypeOfPlaceButtonProps = {
	typeOfPlace: TypeOfPlaceProps;
	toggleTypeOfPlace: (place: TypeOfPlaceProps) => void;
};

export const TypeOfPlaceButton: React.FC<TypeOfPlaceButtonProps> = ({ typeOfPlace, toggleTypeOfPlace }) => {
	return (
		<ButtonLayout title="写真の枚数：">
			<ButtonCmp type="place" label="2枚：着工前後" place="school" />
			<ButtonCmp type="place" label="3枚：作業前後" place="park" />
		</ButtonLayout>
	);
};

type TypeOfPictureButtonProps = {};

export const TypeOfPictureButton: React.FC<TypeOfPictureButtonProps> = () => {
	return (
		<ButtonLayout title="写真の種類：" style={{ mt: "1rem" }}>
			<ButtonCmp type="picture" label="作業前" picture="beforeConstruct" />
			<ButtonCmp type="picture" label="作業後" picture="afterConstruct" />
		</ButtonLayout>
	);
};
