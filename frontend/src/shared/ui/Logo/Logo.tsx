import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./Logo.module.scss";
import { AppLink } from "../AppLink/AppLink";
import { RoutePaths, type AppRoutes } from "@/shared/const/router";

interface LogoProps {
	className?: string;
	to?: AppRoutes;
	type?: "accent" | "normal";
}

export const Logo = memo((props: LogoProps) => {
	const { className, to = RoutePaths.main } = props;
	return (
		<AppLink
			to={to}
			className={classNames(cls.logoWrapper, {}, [className])}
		>
			<div className={cls.logo}>KANBAN</div>
		</AppLink>
	);
});
