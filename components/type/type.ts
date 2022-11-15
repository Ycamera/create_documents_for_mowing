export type ImageProps = {
	beforeConstruct?: string;
	afterConstruct?: string;
	firstImage?: string;
	secondImage?: string;
	thirdImage?: string;
};
export type ImageKeyProps = "beforeConstruct" | "afterConstruct" | "firstImage" | "secondImage" | "thirdImage";

export type ImageChangeHandlerProps = (e: any, imageKey: ImageKeyProps) => void;

export type InfoProps = {
	place: string;
	number: number | "";
	time: number | "";
};

export type OsProps = "windows" | "mac";
export type TypeOfPlaceProps = "school" | "park";
export type TypeOfPictureProps = "beforeConstruct" | "afterConstruct";

export type FormInfoContextProps = {
	imageChangeHandler: any;
	numberChangeHandler: any;
	placeChangeHandler: any;
	info: InfoProps;
	images: ImageProps;
	os: OsProps;
	toggleOs: () => void;
	typeOfPlace: TypeOfPlaceProps;
	toggleTypeOfPlace: (place: TypeOfPlaceProps) => void;
	resetForm: () => void;
	handleSubmit: any;
};

export type typeOfPlaceContextsProps = {
	typeOfPlace: TypeOfPlaceProps;
	toggleTypeOfPlace: (place: TypeOfPlaceProps) => void;
	typeOfPicture: TypeOfPictureProps;
	toggleTypeOfPicture: (picture: TypeOfPictureProps) => void;
};
