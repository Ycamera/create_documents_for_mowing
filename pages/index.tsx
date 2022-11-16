import React, { useEffect, useState } from "react";
import { Box, Heading, Flex, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Head from "next/head";
import {
	ImageProps,
	InfoProps,
	OsProps,
	FormInfoContextProps,
	TypeOfPlaceProps,
	TypeOfPictureProps,
	typeOfPlaceContextsProps,
} from "../components/type/type";

import { Forms } from "../components/Forms";

import exportExcel from "../libs/exportExcel";
import LoadingBg from "../components/LoadingBg";

export const useFormContext = React.createContext<Partial<{ register: any; errors: any }>>({});
export const resetContext = React.createContext<Partial<{ reset: boolean; setReset: any }>>({});
export const formInfoContext = React.createContext<Partial<FormInfoContextProps>>({});
export const typeOfPlaceContexts = React.createContext<Partial<typeOfPlaceContextsProps>>({});

type InitProps = {
	images: ImageProps;
	info: InfoProps;
};

const init: InitProps = {
	images: { beforeConstruct: "", afterConstruct: "", firstImage: "", secondImage: "", thirdImage: "" },
	info: { place: "", number: "", time: "" },
};

export default function Home() {
	const [images, setImages] = useState<ImageProps>(init.images);
	const [info, setInfo] = useState<InfoProps>(init.info);
	const [typeOfPlace, setTypeOfPlace] = useState<TypeOfPlaceProps>("school");
	const [typeOfPicture, setTypeOfPicture] = useState<TypeOfPictureProps>("beforeConstruct");

	const [os, setOs] = useState<OsProps>("windows");

	//OS　切り替え
	function toggleOs(): void {
		setOs((prev) => {
			if (prev === "windows") return "mac";
			return "windows";
		});
	}

	//現場の種類　切り替え
	function toggleTypeOfPlace(place: TypeOfPlaceProps): void {
		setTypeOfPlace((prev) => {
			// resetForm();
			return place;
		});
	}

	function toggleTypeOfPicture(picture: TypeOfPictureProps): void {
		setTypeOfPicture((prev) => {
			return picture;
		});
	}

	function imageChangeHandler(e: any, imageKey: string): void {
		const file = e.target.files[0];
		const reader = new FileReader();

		if (!file) {
			return setImages((prev) => {
				return { ...prev, [imageKey]: "" };
			});
		}

		reader.readAsDataURL(file);

		reader.onload = function (): void {
			const imageUrl = reader.result;
			setImages((prev) => {
				return { ...prev, [imageKey]: imageUrl };
			});
		};
	}

	function numberChangeHandler(e: any, setKey: "number" | "time") {
		const value = e.target.value;
		const numbers = value.replace(/\D/g, function (s: any) {
			return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
		});
		const num = numbers.replace(/\D/g, "");

		setInfo((prev) => {
			return { ...prev, [setKey]: num };
		});
	}

	function placeChangeHandler(e: any) {
		const value = e.target.value;
		setInfo((prev) => {
			return { ...prev, place: value };
		});
	}

	//エクセル生成時にDLまで画面を暗転
	const [turnBgIntoDark, setTurnBgIntoDark] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	async function onSubmit() {
		setTurnBgIntoDark(true);
		const response = await exportExcel(info, images, typeOfPlace, typeOfPicture, os);
		if (response) setTurnBgIntoDark(false);
	}

	//フォーム内容をリセット
	function resetForm(): void {
		setInfo(init.info);
		setImages(init.images);

		const imageElements = document.getElementsByClassName("construct-image");
		for (let i = 0; i < imageElements.length; i++) {
			const imageElement = imageElements[i] as HTMLInputElement;
			imageElement.value = "";
		}
		reset();
	}

	return (
		<>
			<Head>
				<title>草刈り業務用 -資料作成ソフト-</title>
				<meta name="author" content="Ryosuke.K" />
				<meta name="description" content="草刈り業務の報告書作成ソフト" />
				<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0" />
			</Head>
			<useFormContext.Provider value={{ register, errors }}>
				<formInfoContext.Provider
					value={{
						info,
						images,
						os,
						toggleOs,
						typeOfPlace,
						toggleTypeOfPlace,
						resetForm,
						placeChangeHandler,
						imageChangeHandler,
						numberChangeHandler,
						handleSubmit: handleSubmit(onSubmit),
					}}
				>
					<typeOfPlaceContexts.Provider
						value={{ typeOfPlace, toggleTypeOfPlace, typeOfPicture, toggleTypeOfPicture }}
					>
						<LoadingBg turnBgIntoDark={turnBgIntoDark} />

						<Box
							w="calc(100% - 2rem)"
							maxW="50rem"
							mx="auto"
							my={{ base: "2rem", sm: "4rem" }}
							color="gray.900"
						>
							<Heading
								textAlign="center"
								color="gray.600"
								as="h1"
								fontSize="2rem"
								mb={{ base: "2rem", sm: "4rem" }}
							>
								草刈り業務用
								<Text fontSize="1rem" mt="0.5rem" color="gray.400">
									-資料作成ソフト-
								</Text>
							</Heading>

							<Flex display="flex" mt="-2rem" mr={{ base: "1rem", sm: "2rem" }} mb="0.5rem">
								<Box color="gray.500" ml="auto">
									For Windows
								</Box>
							</Flex>

							<Forms typeOfPlace={typeOfPlace} />
						</Box>
					</typeOfPlaceContexts.Provider>
				</formInfoContext.Provider>
			</useFormContext.Provider>
		</>
	);
}
