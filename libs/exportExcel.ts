import { KeyObjectType } from "crypto";
import ExcelJS from "exceljs";
import { ImageProps, InfoProps, OsProps, TypeOfPictureProps, TypeOfPlaceProps } from "../components/type/type";

function formatDate(date: number) {
	if (date < 10) return `0` + date;
	return date;
}
async function exportExcel(
	info: InfoProps,
	images: ImageProps,
	typeOfPlace: TypeOfPlaceProps,
	typeOfPicture: TypeOfPictureProps,
	os: OsProps
) {
	const { place, number, time } = info;
	const date = new Date();

	const today = `${date.getFullYear()}${formatDate(date.getMonth() + 1)}${formatDate(date.getDate())}`;
	const fileName = `${today}_${place}_${number ? `No_${number}_` : ""}${time}回目`;

	const numberStr = number ? "No." + number : "";
	const timeStr = time + "回目";

	const infoArray: string[] = [];
	infoArray.push(place);
	if (numberStr) infoArray.push(numberStr);
	infoArray.push(timeStr);

	//旧式 worksheet 画像サイズ　２、３枚用
	// windows imagewidth = 370 imageHeight = 302
	const imageWidth = 369;
	const imageHeight = 301;
	const imageTlCol = 0.15;
	const imageTlRow = 0.5;

	const infoStartPos = "E";
	const infoMergeEndPos = "F";
	const infoStartRowNum = 2;

	const workbook = new ExcelJS.Workbook();

	workbook.addWorksheet(place);

	const worksheet = workbook.getWorksheet(place);
	worksheet.pageSetup.paperSize = 9;
	worksheet.pageSetup.printArea = "A1:F36";
	worksheet.pageSetup.fitToPage = true;
	worksheet.pageSetup.horizontalCentered = true;

	type BorderStyleProps = "top" | "left" | "right" | "bottom";

	function borderStyle(pos: BorderStyleProps, pos2?: BorderStyleProps) {
		const border = { style: "thin", color: { argb: "4A5568" } };

		const style = { [pos]: border };
		if (pos2) {
			style[pos2] = border;
		}
		return style;
	}

	//セクセルにボーダーを追加
	function addBorderToExcel(width: number, height: number, cellHeight?: number) {
		for (let rowNum = 1; rowNum <= height; rowNum++) {
			const sheetRow = worksheet.getRow(rowNum);

			if (cellHeight) sheetRow.height = cellHeight;

			for (let colNum = 1; colNum <= width; colNum++) {
				const cell = sheetRow.getCell(colNum);

				if (colNum === 1) cell.border = borderStyle("left");
				if (colNum === 6 || colNum === 4) cell.border = borderStyle("right");

				if (rowNum === 1) {
					if (colNum === 1) {
						cell.border = borderStyle("left", "top");
					} else if (colNum === 6 || colNum === 4) {
						cell.border = borderStyle("right", "top");
					} else {
						cell.border = borderStyle("top");
					}
				}
				const h = Math.floor(height / 3);
				if (rowNum === h || rowNum === h * 2 || rowNum === h * 3) {
					if (colNum === 1) {
						cell.border = borderStyle("left", "bottom");
					} else if (colNum === 6 || colNum === 4) {
						cell.border = borderStyle("right", "bottom");
					} else {
						cell.border = borderStyle("bottom");
					}
				}
			}
		}
	}

	if (typeOfPlace === "school") {
		addRowsForOldSchool();
	} else if (typeOfPlace === "park") {
		addRowsForOldPark();
	}

	// UInt8Arrayを生成
	const uint8Array = await workbook.xlsx.writeBuffer();
	// Blob
	const blob = new Blob([uint8Array], { type: "application/octet-binary" });
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = fileName + ".xlsx";
	a.click();
	a.remove();

	return true;

	function addRowsForNewSchool() {
		worksheet.properties.defaultColWidth = 60;
		worksheet.columns = [{ header: place, key: "id" }];

		const imageBeforeConstruct = workbook.addImage({
			base64: images.beforeConstruct,
			extension: "jpeg",
		});

		const imageAfterConstruct = workbook.addImage({
			base64: images.afterConstruct,
			extension: "jpeg",
		});

		worksheet.addRow({ id: numberStr ? numberStr + "　　" + timeStr : timeStr });

		worksheet.addRow({ id: "着工前" });
		worksheet.addRow({ id: "" });
		worksheet.addRow({ id: "" });

		worksheet.addImage(imageBeforeConstruct, "A5:A5");

		worksheet.addRow({ id: "着工後" });
		worksheet.addRow({ id: "" });
		worksheet.addRow({ id: "" });

		worksheet.addImage(imageAfterConstruct, "A8:A8");

		function adjustHeight(height: number): number {
			if (os === "windows") return height * 1.5;
			return height;
		}

		const headerFontStyle = {
			size: 24,
		};
		const subHeaderFontStyle = {
			size: 20,
		};
		const defaultFontStyle = {
			size: 18,
			color: { argb: "4A5568" },
		};

		worksheet.eachRow((row, rowNumber) => {
			row.eachCell((cell) => {
				//場所名
				if (rowNumber === 1) {
					cell.font = headerFontStyle;
				}
				//ナンバー　回数
				if (rowNumber === 2) {
					cell.font = subHeaderFontStyle;
					cell.border = { bottom: { style: "thin", color: { argb: "A4A4A4" } } };
				}

				//着工前　着工後
				if (rowNumber === 3 || rowNumber === 6) {
					cell.font = defaultFontStyle;
					cell.alignment = { vertical: "bottom", horizontal: "center" };
				} else {
					cell.alignment = { vertical: "middle", horizontal: "center" };
				}
			});

			//場所名
			if (rowNumber === 1) {
				row.height = adjustHeight(32);
			}
			//ナンバー　回数
			if (rowNumber === 2) {
				row.height = adjustHeight(32);
			}
			//着工前
			if (rowNumber === 3) {
				row.height = adjustHeight(50);
			}
			//着工後
			if (rowNumber === 6) {
				row.height = adjustHeight(40);
			}
			if (rowNumber === 4 || rowNumber === 7) {
				row.height = adjustHeight(12);
			}
			//画像
			if (rowNumber === 5 || rowNumber === 8) {
				row.height = adjustHeight(180);
			}
		});
	}

	function setDefaultColWidthAndCellHeight(): number {
		//	Mac width:12 height:15.5
		// 	Windows width:13 height:22
		worksheet.properties.defaultColWidth = os === "windows" ? 13 : 12;
		return os === "windows" ? 22 : 15.5;
	}

	function addTextAndMergeCell(rowNum: number, text: string) {
		worksheet.mergeCells(`${infoStartPos + rowNum}:${infoMergeEndPos}${rowNum}`);

		const cell = worksheet.getCell(infoStartPos + rowNum);
		cell.value = text;
		cell.alignment = { vertical: "middle", horizontal: "center" };
	}

	function addRowsForOldSchool() {
		const cellHeight = setDefaultColWidthAndCellHeight();

		const imageBeforeConstruct = workbook.addImage({
			base64: images.beforeConstruct,
			extension: "jpeg",
		});

		const imageAfterConstruct = workbook.addImage({
			base64: images.afterConstruct,
			extension: "jpeg",
		});

		// worksheet.addImage(imageBeforeConstruct, "A2:D11");
		// worksheet.addImage(imageAfterConstruct, "A14:D23");

		worksheet.addImage(imageBeforeConstruct, {
			tl: { col: 0 + imageTlCol, row: 0 + imageTlRow },
			ext: { width: imageWidth, height: imageHeight },
			editAs: "absolute",
		});

		worksheet.addImage(imageAfterConstruct, {
			tl: { col: 0 + imageTlCol, row: 12 + imageTlRow },
			ext: { width: imageWidth, height: imageHeight },
			editAs: "absolute",
		});

		infoArray.forEach((text, index) => {
			const mergeCellRowNum = infoStartRowNum + index;
			addTextAndMergeCell(mergeCellRowNum, text);
		});

		addTextAndMergeCell(infoStartRowNum + 3, "作業前");
		addTextAndMergeCell(infoStartRowNum + 15, "作業後");

		addBorderToExcel(6, 36, cellHeight);
	}

	function addRowsForOldPark() {
		const cellHeight = setDefaultColWidthAndCellHeight();

		infoArray.forEach((text, index) => {
			const mergeCellRowNum = infoStartRowNum + index;
			addTextAndMergeCell(mergeCellRowNum, text);
		});
		const textOfConstruct = getStrOfTypeOfPicture(typeOfPicture);
		addTextAndMergeCell(infoStartRowNum + 3, textOfConstruct);

		const ImageRowStart = [0, 12, 24];
		const mergeAndInsertText = [0, 15, 27];

		const keys: ("firstImage" | "secondImage" | "thirdImage")[] = ["firstImage", "secondImage", "thirdImage"];
		const imagesToAdd: number[] = [];

		keys.forEach((key) => {
			const image = images[key];

			if (image && image.length) {
				const addImage = workbook.addImage({
					base64: image,
					extension: "jpeg",
				});
				imagesToAdd.push(addImage);
			}
		});

		// if (images.firstImage) {
		// 	const firstImage = workbook.addImage({
		// 		base64: images.firstImage,
		// 		extension: "jpeg",
		// 	});
		// 	imagesToAdd.push(firstImage);
		// }

		// if (images.secondImage) {
		// 	const secondImage = workbook.addImage({
		// 		base64: images.secondImage,
		// 		extension: "jpeg",
		// 	});

		// 	imagesToAdd.push(secondImage);
		// }

		// if (images.thirdImage) {
		// 	const thirdImage = workbook.addImage({
		// 		base64: images.thirdImage,
		// 		extension: "jpeg",
		// 	});

		// 	imagesToAdd.push(thirdImage);
		// }

		imagesToAdd.forEach((image, index) => {
			worksheet.addImage(image, {
				tl: { col: 0 + imageTlCol, row: ImageRowStart[index] + imageTlRow },
				ext: { width: imageWidth, height: imageHeight },
				editAs: "absolute",
			});
			if (index !== 0) {
				addTextAndMergeCell(infoStartRowNum + mergeAndInsertText[index], textOfConstruct);
			}
		});

		addBorderToExcel(6, 36, cellHeight);
	}
}

export default exportExcel;

function getStrOfTypeOfPicture(typeOfPicture: TypeOfPictureProps) {
	if (typeOfPicture === "beforeConstruct") return "作業前";
	return "作業後";
}
