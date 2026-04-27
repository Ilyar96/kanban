import { memo, type ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./AppLink.module.scss";

export type AppLinkTheme = "primary" | "secondary";

interface AppLinkProps extends LinkProps {
	className?: string;
	theme?: AppLinkTheme;
	children?: ReactNode;
}

export const AppLink = memo((props: AppLinkProps) => {
	const { to, className, children, theme = "primary", ...otherProps } = props;

	return (
		<Link
			className={classNames(cls.appLink, {}, [className, cls[theme]])}
			to={to}
			{...otherProps}
		>
			{children}
		</Link>
	);
});
