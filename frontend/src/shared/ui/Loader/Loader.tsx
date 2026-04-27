import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Loader.module.scss";

interface LoaderProps {
	className?: string;
	size?: "s" | "m" | "l";
	type?: "accent" | "primary" | "secondary";
}

export const Loader = (props: LoaderProps) => {
	const { className, size = "l", type = "primary" } = props;
	return (
		<div className={classNames(cls.loader, {}, [className, cls[size], cls[type]])}>
			<div />
			<div />
			<div />
			<div />
		</div>
	);
};
