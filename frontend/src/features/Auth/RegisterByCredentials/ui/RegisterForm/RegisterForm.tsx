import { memo, useCallback, type SubmitEvent } from "react";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch/useAppDispatch";
import { useSelector } from "react-redux";
import { useAuthRedirect } from "@/shared/lib/hooks/useAuthRedirect/useAuthRedirect";
import { getRegisterUsername } from "../../model/selectors/getRegisterUsername/getRegisterUsername";
import { getRegisterPassword } from "../../model/selectors/getRegisterPassword/getRegisterPassword";
import { registerByCredentials } from "../../model/services/registerByCredentials/registerByCredentials";
import { getRegisterEmail } from "../../model/selectors/getRegisterEmail/getRegisterEmail";
import { registerActions, registerReducer } from "../../model/slice/registerByCredentialsSlice";
import { VStack } from "@/shared/ui/Stack";
import { Card } from "@/shared/ui/Card/Card";
import { TextField } from "@/shared/ui/TextField/TextField";
import { Button } from "@/shared/ui/Button/Button";
import { Text } from "@/shared/ui/Text/Text";
import { AppLink } from "@/shared/ui/AppLink/AppLink";
import { RoutePaths } from "@/shared/const/router";
import { getRegisterIsLoading } from "../../model/selectors/getRegisterIsLoading/getRegisterIsLoading";
import { getRegisterError } from "../../model/selectors/getRegisterError/getRegisterError";
import {
	DynamicModuleLoader,
	type ReducersList,
} from "@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";

interface RegisterFormProps {
	className?: string;
}

const reducers: ReducersList = {
	registerForm: registerReducer,
};

export const RegisterForm = memo(({ className }: RegisterFormProps) => {
	const dispatch = useAppDispatch();
	const { redirectAfterAuth } = useAuthRedirect();
	const username = useSelector(getRegisterUsername);
	const email = useSelector(getRegisterEmail);
	const password = useSelector(getRegisterPassword);
	const isLoading = useSelector(getRegisterIsLoading);
	const error = useSelector(getRegisterError);

	const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isLoading) {
			return;
		}

		const result = await dispatch(registerByCredentials({ username, email, password }));

		if (registerByCredentials.fulfilled.match(result)) {
			redirectAfterAuth(RoutePaths.main);
		}
	};

	const onUsernameChange = useCallback(
		(value: string) => {
			dispatch(registerActions.setUsername(value));
		},
		[dispatch],
	);

	const onEmailChange = useCallback(
		(value: string) => {
			dispatch(registerActions.setEmail(value));
		},
		[dispatch],
	);

	const onPasswordChange = useCallback(
		(value: string) => {
			dispatch(registerActions.setPassword(value));
		},
		[dispatch],
	);

	return (
		<DynamicModuleLoader reducers={reducers}>
			<VStack
				as={Card}
				gap="16"
				className={className}
			>
				<VStack
					as="form"
					gap="16"
					max
					onSubmit={onSubmit}
				>
					<TextField
						name="username"
						value={username}
						onChange={onUsernameChange}
						placeholder="Введите имя"
						error={error && typeof error !== "string" ? error.issues?.username : undefined}
					/>
					<TextField
						name="email"
						value={email}
						onChange={onEmailChange}
						placeholder="Введите email"
						error={error && typeof error !== "string" ? error.issues?.email : undefined}
					/>
					<TextField
						name="password"
						type="password"
						value={password}
						onChange={onPasswordChange}
						placeholder="Введите пароль"
						error={error && typeof error !== "string" ? error.issues?.password : undefined}
					/>
					<Button
						type="submit"
						size="l"
						fullWidth
						disabled={isLoading}
					>
						Зарегистрироваться
					</Button>
				</VStack>

				<Text size="s">
					Уже зарегистрированы? <AppLink to={RoutePaths["login"]}>Войти</AppLink>
				</Text>
				{error && (
					<Text
						size="s"
						theme="error"
					>
						Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.
					</Text>
				)}
			</VStack>
		</DynamicModuleLoader>
	);
});
