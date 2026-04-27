import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import { LoginForm, RegisterForm } from "@/features/Auth";
import cls from "./AuthFormWidget.module.scss";
import { HStack, VStack } from "@/shared/ui/Stack";
import { Container } from "@/shared/ui/Container/Container";

interface AuthFormWidgetProps {
	className?: string;
	type: "login" | "register";
}

export const AuthFormWidget = memo((props: AuthFormWidgetProps) => {
	const { className, type } = props;
	const formClassName = cls.formClassName;

	return (
		<VStack
			align="center"
			justify="center"
			className={classNames(cls.authFormWidget, {}, [className])}
		>
			<HStack
				as={Container}
				justify="center"
			>
				{type === "login" ? (
					<LoginForm className={formClassName} />
				) : (
					<RegisterForm className={formClassName} />
				)}
			</HStack>
		</VStack>
	);
});
