import React, { ReactNode, useContext } from "react";
import { Input, FormControl, FormLabel, Flex, Box, Grid } from "@chakra-ui/react";
import { typeOfPlaceContextsProps, TypeOfPlaceProps, TypeOfPictureProps } from "../components/type/type";
import { generateKey } from "crypto";
import { typeOfPlaceContexts } from "../pages";

type ButtonCmpProps = {
	type: "place" | "picture";
	label: "学校" | "公園" | "作業前" | "作業後";
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
			color: "gray.500",
			bg: "gray.200",
			borderRadius,
			_hover: {
				boxShadow: "0 0.1rem 0.5rem gray",
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
			<Box fontSize="1.2rem" mb="2">
				{title}
			</Box>
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
		<ButtonLayout title="現場の種類：">
			<ButtonCmp type="place" label="学校" place="school" />
			<ButtonCmp type="place" label="公園" place="park" />
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
