import React, { useState, useContext, ReactNode, useEffect } from "react";
import { Box, Button, Grid } from "@chakra-ui/react";

import { formInfoContext } from "../pages";

import { FormInfoContextProps, InfoProps, TypeOfPlaceProps } from "../components/type/type";
import { UploadImagesForSchool, UploadImagesForPark } from "../components/UploadImage";
import CommonForm from "../components/CommonForm";
import OsButton from "../components/OsButton";
import { TypeOfPictureButton, TypeOfPlaceButton } from "../components/TypeOfPlaceButton";

type FormLayoutProps = {
	children: ReactNode;
	ParkOptionButton?: React.FC;
};

const FormLayout: React.FC<FormLayoutProps> = ({ children, ParkOptionButton }) => {
	const {
		info,
		images,
		os,
		toggleOs,
		typeOfPlace,
		toggleTypeOfPlace,
		resetForm,
		placeChangeHandler,

		numberChangeHandler,
		handleSubmit,
	} = useContext(formInfoContext) as FormInfoContextProps;

	const [downloadButtonActive, setDownloadButtonActive] = useState<boolean>(false);

	useEffect(() => {
		const { place, time } = info;
		if (!(place && time)) return setDownloadButtonActive(false);

		if (typeOfPlace === "school") {
			if (images.beforeConstruct && images.afterConstruct) {
				setDownloadButtonActive(true);
			}
		} else {
			if (images.firstImage) {
				setDownloadButtonActive(true);
			}
		}
	}, [images, typeOfPlace, info]);

	return (
		<form>
			<Box boxShadow="0 0 0.2rem gray" px={{ base: "1rem", sm: "2rem" }} py="2rem" borderRadius="1rem">
				<Box w="100%" mx="auto">
					<TypeOfPlaceButton typeOfPlace={typeOfPlace} toggleTypeOfPlace={toggleTypeOfPlace} />
					{ParkOptionButton && <ParkOptionButton />}
					<CommonForm
						label="現場名："
						onChange={placeChangeHandler}
						value={info.place}
						name="place"
						id="place"
						nextInputId="number"
						required={true}
					/>

					<Grid
						templateRows="1"
						templateColumns={{ base: "repeat(1,1fr)", sm: "repeat(2,1fr)" }}
						gap={{ base: "0", sm: "2rem" }}
					>
						<CommonForm
							label="図面No."
							onChange={(e: React.ChangeEvent) => numberChangeHandler(e, "number")}
							value={info.number}
							name="number"
							id="number"
							nextInputId="time"
						/>
						<CommonForm
							label="回数"
							onChange={(e: React.ChangeEvent) => numberChangeHandler(e, "time")}
							value={info.time}
							name="time"
							id="time"
							required={true}
						/>
					</Grid>
				</Box>
				{children}

				{/* <OsButton os={os} toggleOs={toggleOs} /> */}
				<Grid mt="3rem" templateRows="1" templateColumns="repeat(2,1fr)" gap="2rem">
					<Button
						colorScheme="orange"
						onClick={(e) => {
							e.preventDefault();
							resetForm();
						}}
					>
						リセット
					</Button>
					<Button
						colorScheme={downloadButtonActive ? "messenger" : "gray"}
						{...(!downloadButtonActive && { color: "gray.400" })}
						onClick={(e) => {
							e.preventDefault();
							handleSubmit();
						}}
					>
						ダウンロード
					</Button>
				</Grid>
			</Box>
		</form>
	);
};

const FormForSchool = () => {
	return (
		<FormLayout>
			<UploadImagesForSchool />
		</FormLayout>
	);
};

const FormForOldPark = () => {
	return (
		<FormLayout ParkOptionButton={TypeOfPictureButton}>
			<UploadImagesForPark />
		</FormLayout>
	);
};

type FormProps = {
	typeOfPlace: TypeOfPlaceProps;
};
export const Forms: React.FC<FormProps> = ({ typeOfPlace }) => {
	return typeOfPlace === "school" ? <FormForSchool /> : <FormForOldPark />;
};
