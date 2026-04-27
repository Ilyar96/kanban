import { memo, useCallback, type SubmitEvent } from "react";
import { useSelector } from "react-redux";
import { TextField } from "@/shared/ui/TextField/TextField";
import { Card } from "@/shared/ui/Card/Card";
import { Button } from "@/shared/ui/Button/Button";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch/useAppDispatch";
import { useAuthRedirect } from "@/shared/lib/hooks/useAuthRedirect/useAuthRedirect";
import { loginByUsername } from "../../model/services/loginByUsername/loginByUsername";
import { VStack } from "@/shared/ui/Stack";
import { Text } from "@/shared/ui/Text/Text";
import { AppLink } from "@/shared/ui/AppLink/AppLink";
import { getLoginPassword } from "../../model/selectors/getLoginPassword/getLoginPassword";
import { loginActions, loginReducer } from "../../model/slice/loginByCredentialsSlice";
import { getLoginUsernameOrEmail } from "../../model/selectors/getLoginUsernameOrEmail/getLoginUsernameOrEmail";
import { RoutePaths } from "@/shared/const/router";
import { getLoginError } from "../../model/selectors/getLoginError/getLoginError";
import { getLoginIsLoading } from "../../model/selectors/getLoginIsLoading/getLoginIsLoading";
import {
	DynamicModuleLoader,
	type ReducersList,
} from "@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";

interface LoginFormProps {
	className?: string;
}

const reducers: ReducersList = {
	loginForm: loginReducer,
};

export const LoginForm = memo(({ className }: LoginFormProps) => {
	const dispatch = useAppDispatch();
	const { redirectAfterAuth } = useAuthRedirect();
	const usernameOrEmail = useSelector(getLoginUsernameOrEmail);
	const password = useSelector(getLoginPassword);
	const isLoading = useSelector(getLoginIsLoading);
	const error = useSelector(getLoginError);

	const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isLoading) {
			return;
		}

		const result = await dispatch(loginByUsername({ usernameOrEmail, password }));

		if (loginByUsername.fulfilled.match(result)) {
			redirectAfterAuth(RoutePaths.main);
		}
	};

	const onUsernameOrEmailChange = useCallback(
		(value: string) => {
			dispatch(loginActions.setUsernameOrEmail(value));
		},
		[dispatch],
	);

	const onPasswordChange = useCallback(
		(value: string) => {
			dispatch(loginActions.setPassword(value));
		},
		[dispatch],
	);

	return (
		<DynamicModuleLoader reducers={reducers}>
			<VStack
				as={Card}
				gap="12"
				className={className}
			>
				<VStack
					as="form"
					gap="8"
					max
					onSubmit={onSubmit}
				>
					<TextField
						name="usernameOrEmail"
						value={usernameOrEmail}
						onChange={onUsernameOrEmailChange}
						placeholder="Введите имя или email"
						error={error && typeof error !== "string" ? error.issues?.usernameOrEmail : undefined}
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
						Войти
					</Button>
				</VStack>

				<Text size="s">
					Еще не зарегистрированы? <AppLink to={RoutePaths["register"]}>Зарегистрироваться</AppLink>
				</Text>

				{error && (
					<Text
						size="s"
						theme="error"
					>
						Произошла ошибка при входе. Пожалуйста, попробуйте снова.
					</Text>
				)}
			</VStack>
		</DynamicModuleLoader>
	);
});
