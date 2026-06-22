import { memo, type ReactNode } from "react";
import { classNames, type Mods } from "@/shared/lib/classNames/classNames";
import cls from "./Text.module.scss";

export type TextTheme = "primary" | "secondary" | "inverted" | "error";

export type TextAlign = "right" | "left" | "center";

export type TextSize = "xs" | "s" | "m" | "l";

interface TextProps {
	className?: string;
	title?: string;
	text?: string;
	theme?: TextTheme;
	align?: TextAlign;
	size?: TextSize;
	children?: ReactNode;
}

type HeaderTag = "h1" | "h2" | "h3" | "h4";

const mapSizeToHeaderTag: Record<TextSize, HeaderTag> = {
	["xs"]: "h4",
	["s"]: "h3",
	["m"]: "h2",
	["l"]: "h1",
};

export const Text = memo((props: TextProps) => {
	const { title, text, className, theme = "primary", align = "left", size = "m", children } = props;

	const HeaderTag = mapSizeToHeaderTag[size];

	const mods: Mods = {
		[cls[theme]]: theme,
		[cls[align]]: align,
		[cls[size]]: size,
	};

	return (
		<div className={classNames(cls.textWrapper, mods, [className])}>
			{title && (
				<HeaderTag className={classNames(cls.title, { [cls.onlyTitle]: !text }, [])}>
					{title}
				</HeaderTag>
			)}
			{text && <p className={cls.text}>{text}</p>}
			{children}
		</div>
	);
});
