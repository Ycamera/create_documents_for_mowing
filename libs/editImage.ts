function editImage(imageUrl: string) {
	return new Promise((resolve) => {
		const canvas: HTMLCanvasElement = document.createElement("canvas");

		const width = 400;
		const height = 300;
		const margin = 5;

		const fullWidth = width + margin * 2;
		const fullHeight = height + margin * 2;

		canvas.width = fullWidth;
		canvas.height = fullHeight;

		const ctx = canvas.getContext("2d");

		if (ctx === null) return;

		ctx.rect(0, 0, fullWidth, fullHeight);
		ctx.fillStyle = "transparent";
		ctx.fill();

		const img = new Image();

		img.onload = () => {
			ctx.drawImage(img, margin, margin, width, height);
			const dataUrl = canvas.toDataURL("image/png", 1.0);
			resolve(dataUrl);
		};

		img.src = imageUrl;
	});
}
export default editImage;
