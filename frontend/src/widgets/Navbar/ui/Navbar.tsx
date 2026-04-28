import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import { Container } from "@/shared/ui/Container/Container";
import { getUserAuthData } from "@/entities/User";
import { useSelector } from "react-redux";
import { Logo } from "@/shared/ui/Logo/Logo";
import { HStack } from "@/shared/ui/Stack";
import cls from "./Navbar.module.scss";
import { AvatarDropdown } from "@/features/AvatarDropdown";
import { AppLink } from "@/shared/ui/AppLink/AppLink";
import { RoutePaths } from "@/shared/const/router";

interface NavbarProps {
	className?: string;
}

export const Navbar = memo(({ className }: NavbarProps) => {
	const authData = useSelector(getUserAuthData);

	return (
		<div className={classNames(cls.navbar, {}, [className])}>
			<HStack
				as={Container}
				align="center"
				justify="between"
				gap="12"
			>
				<Logo className={cls.logo} />

				{authData ? <AvatarDropdown /> : <AppLink to={RoutePaths.login}>Войти</AppLink>}
			</HStack>
		</div>
	);
});
