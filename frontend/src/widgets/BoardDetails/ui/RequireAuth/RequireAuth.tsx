import { memo } from "react";
import cls from "./RequireAuth.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import { Text } from "@/shared/ui/Text/Text";
import { VStack } from "@/shared/ui/Stack";
import { AppLink } from "@/shared/ui/AppLink/AppLink";
import { Button } from "@/shared/ui/Button/Button";
import { useNavigate } from "react-router-dom";

interface RequireAuthProps {
	className?: string;
}

export const RequireAuth = memo(({ className }: RequireAuthProps) => {
	const navigate = useNavigate();

	const onRegisterClick = () => {
		navigate("/register");
	};

	return (
		<VStack
			align="center"
			justify="center"
			className={classNames(cls.requireAuth, {}, [className])}
			gap="xxl"
		>
			<VStack
				gap="s"
				align="center"
			>
				<h1 className={cls.title}>Зарегистрируйтесь, чтобы открыть эту доску</h1>
				<Text>Чтобы открыть эту доску, войдите в свой аккаунт.</Text>
			</VStack>
			<VStack
				align="center"
				gap="m"
			>
				<Button onClick={onRegisterClick}>Бесплатная регистрация</Button>
				<AppLink to="/login">Уже есть аккаунт? Войдите в него</AppLink>
			</VStack>
		</VStack>
	);
});
