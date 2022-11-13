import ExcelJS from "exceljs";
import { ImageProps, InfoProps } from "../components/type/type";

async function exportExcel(info: InfoProps, images: ImageProps) {
	const { place, number, time } = info;
	const fileName = info.place;

	const workbook = new ExcelJS.Workbook();

	workbook.addWorksheet(place);

	const worksheet = workbook.getWorksheet(place);
	worksheet.pageSetup.paperSize = 9;
	worksheet.pageSetup.orientation = "portrait";
	worksheet.pageSetup.horizontalCentered = true;
	worksheet.pageSetup.printArea = "A1:A8";
	worksheet.pageSetup.fitToPage = true;

	worksheet.columns = [{ header: place, key: "id", width: 60 }];

	const imageBeforeConstruct = workbook.addImage({
		base64: images.beforeConstruct,
		extension: "jpeg",
	});

	const imageAfterConstruct = workbook.addImage({
		base64: images.afterConstruct,
		extension: "jpeg",
	});

	worksheet.addRow({ id: "No." + number + "　　" + time + "回目" });

	worksheet.addRow({ id: "着工前" });
	worksheet.addRow({ id: "" });
	worksheet.addRow({ id: "" });

	// worksheet.addImage(imageBeforeConstruct, {
	// 	tl: { col: 0.6, row: 3.9 },
	// 	ext: { width: 400, height: 300 },
	// });
	worksheet.addImage(imageBeforeConstruct, "A5:A5");

	worksheet.addRow({ id: "着工後" });
	worksheet.addRow({ id: "" });
	worksheet.addRow({ id: "" });

	// worksheet.addImage(imageAfterConstruct, {
	// 	tl: { col: 0.6, row: 5.9 },
	// 	ext: { width: 400, height: 300 },
	// });
	worksheet.addImage(imageAfterConstruct, "A8:A8");

	const headerFontStyle = {
		size: 24,
	};
	const subHeaderFontStyle = {
		size: 20,
	};
	const defaultFontStyle = {
		size: 18,
	};

	worksheet.eachRow((row, rowNumber) => {
		row.eachCell((cell) => {
			//場所名
			if (rowNumber === 1) {
				cell.font = headerFontStyle;
			}
			//ナンバー　回数
			if (rowNumber === 2) cell.font = subHeaderFontStyle;

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
			row.height = 32;
		}
		//ナンバー　回数
		if (rowNumber === 2) {
			row.height = 32;
		}
		//着工前
		if (rowNumber === 3) {
			row.height = 50;
		}
		//着工後
		if (rowNumber === 6) {
			row.height = 40;
		}
		if (rowNumber === 4 || rowNumber === 7) {
			row.height = 15;
		}
		//画像
		if (rowNumber === 5 || rowNumber === 8) {
			row.height = 180;
		}
	});

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
}

export default exportExcel;
