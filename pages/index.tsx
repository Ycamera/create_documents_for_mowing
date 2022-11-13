import React, { useState } from "react";
import { Box, Button, Heading, Grid } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { ImageProps, InfoProps } from "../components/type/type";
import UploadImages from "../components/UploadImage";
import CommonForm from "../components/CommonForm";

import exportExcel from "../libs/exportExcel";
import LoadingBg from "../components/LoadingBg";

export const useFormContext = React.createContext<Partial<{ register: any; errors: any }>>({});
export const resetContext = React.createContext<Partial<{ reset: boolean; setReset: any }>>({});

type InitProps = {
	images: ImageProps;
	info: InfoProps;
};

const init: InitProps = {
	images: { beforeConstruct: "", afterConstruct: "" },
	info: { place: "", number: "", time: "" },
};

export default function Home() {
	const [images, setImages] = useState<ImageProps>(init.images);
	const [info, setInfo] = useState<InfoProps>(init.info);

	function imageChangeHandler(e: any, imageKey: string): void {
		const file = e.target.files[0];
		const reader = new FileReader();

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

	function resetForm(): void {
		setInfo(init.info);
		setImages(init.images);
		const imageElements = document.getElementsByClassName("construct-image");
		for (let i = 0; i < imageElements.length; i++) {
			const imageElement = imageElements[i] as HTMLInputElement;
			imageElement.value = "";
		}
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [turnBgIntoDark, setTurnBgIntoDark] = useState<boolean>(false);

	async function onSubmit() {
		setTurnBgIntoDark(true);
		const response = await exportExcel(info, images);
		if (response) setTurnBgIntoDark(false);
	}

	const gridStyle = {
		templateRows: "1",
		templateColumns: { base: "repeat(1,1fr)", sm: "repeat(2,1fr)" },
		gap: { base: "0", sm: "2rem" },
	};

	return (
		<useFormContext.Provider value={{ register, errors }}>
			<LoadingBg turnBgIntoDark={turnBgIntoDark} />
			<Box w="calc(100% - 2rem)" maxW="50rem" mx="auto" my={{ base: "2rem", sm: "4rem" }}>
				<Heading textAlign="center" color="gray.600" as="h1" fontSize="2rem">
					資料作成ソフト
				</Heading>
				<Box
					boxShadow="0 0 0.2rem gray"
					p={{ base: "1rem", sm: "3rem" }}
					borderRadius="1rem"
					mt={{ base: "2rem", sm: "4rem" }}
				>
					<form>
						<Box w="100%" mx="auto" mt="1rem">
							<CommonForm label="現場名:" onChange={placeChangeHandler} value={info.place} name="place" />

							<Grid {...gridStyle}>
								<CommonForm
									label="図面No."
									onChange={(e: any) => numberChangeHandler(e, "number")}
									value={info.number}
									name="number"
								/>
								<CommonForm
									label="回数"
									onChange={(e: any) => numberChangeHandler(e, "time")}
									value={info.time}
									name="time"
								/>
							</Grid>
						</Box>
						<UploadImages images={images} imageChangeHandler={imageChangeHandler} />
						<Grid mt="3rem" {...gridStyle} templateColumns="repeat(2,1fr)" gap="1rem">
							<Button colorScheme="orange" onClick={resetForm}>
								リセット
							</Button>
							<Button colorScheme="messenger" onClick={handleSubmit(onSubmit)}>
								ダウンロード
							</Button>
						</Grid>
					</form>
				</Box>
			</Box>
		</useFormContext.Provider>
	);
}
