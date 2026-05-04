import { type ButtonHTMLAttributes, forwardRef, memo, type ReactNode } from "react";
import { classNames, type Mods } from "@/shared/lib/classNames/classNames";
import cls from "./Button.module.scss";

export type ButtonTheme =
	| "outline"
	| "outline_red"
	| "clear"
	| "clearInverted"
	| "background"
	| "backgroundInverted";

export type ButtonSize = "s" | "m" | "l" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
	theme?: ButtonTheme;
	square?: boolean;
	size?: ButtonSize;
	children?: ReactNode;
	fullWidth?: boolean;
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
	const {
		className = "",
		children,
		theme = "background",
		type = "button",
		square,
		size = "l",
		disabled = false,
		fullWidth,
		...otherProps
	} = props;

	const mods: Mods = {
		[cls.square]: square,
		[cls.fullWidth]: fullWidth,
		[cls.disabled]: disabled,
	};

	const additional: string[] = [className, cls[theme], cls[size]];

	return (
		<button
			ref={ref}
			className={classNames(cls.Button, mods, additional)}
			type={type}
			disabled={disabled}
			{...otherProps}
		>
			{children}
		</button>
	);
});

export const Button = memo(ButtonComponent);
