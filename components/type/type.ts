export type ImageProps = {
	beforeConstruct: string;
	afterConstruct: string;
};
export type ImageKeyProps = "beforeConstruct" | "afterConstruct";

export type ImageChangeHandlerProps = (e: any, imageKey: ImageKeyProps) => void;

export type InfoProps = {
	place: string;
	number: number | "";
	time: number | "";
};
