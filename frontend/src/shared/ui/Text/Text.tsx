import { memo, type ReactNode } from "react";
import { classNames, type Mods } from "@/shared/lib/classNames/classNames";
import cls from "./Text.module.scss";

export type TextTheme = "primary" | "inverted" | "error";

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

	"data-testid"?: string;
}

type HeaderTag = "h1" | "h2" | "h3" | "h4";

const mapSizeToHeaderTag: Record<TextSize, HeaderTag> = {
	["xs"]: "h4",
	["s"]: "h3",
	["m"]: "h2",
	["l"]: "h1",
};

export const Text = memo((props: TextProps) => {
	const {
		title,
		text,
		className,
		theme = "primary",
		align = "left",
		size = "m",
		children,
		"data-testid": dataTestId = "",
	} = props;

	const HeaderTag = mapSizeToHeaderTag[size];

	const mods: Mods = {
		[cls[theme]]: theme,
		[cls[align]]: align,
		[cls[size]]: size,
	};

	return (
		<div className={classNames(cls.textWrapper, mods, [className])}>
			{title && (
				<HeaderTag
					className={cls.title}
					data-testid={`${dataTestId}.Title`}
				>
					{title}
				</HeaderTag>
			)}
			{text && (
				<p
					className={cls.text}
					data-testid={`${dataTestId}.Text`}
				>
					{text}
				</p>
			)}
			{children}
		</div>
	);
});
