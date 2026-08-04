import { memo } from "react";
import { useForm } from "react-hook-form";
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
import { loginReducer } from "../../model/slice/loginByCredentialsSlice";
import { RoutePaths } from "@/shared/const/router";
import { getLoginError } from "../../model/selectors/getLoginError/getLoginError";
import { getLoginIsLoading } from "../../model/selectors/getLoginIsLoading/getLoginIsLoading";
import { applyServerFieldErrors, getServerErrorIssues } from "@/shared/lib/serverError/serverError";
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

interface LoginFormValues {
	usernameOrEmail: string;
	password: string;
}

const normalizeIssueKey = (key: string): keyof LoginFormValues | null => {
	const cleanKey = key.includes(".") ? (key.split(".").at(-1) ?? key) : key;

	if (cleanKey === "usernameOrEmail" || cleanKey === "password") {
		return cleanKey;
	}

	return null;
};

export const LoginForm = memo(({ className }: LoginFormProps) => {
	const dispatch = useAppDispatch();
	const { redirectAfterAuth } = useAuthRedirect();
	const isLoading = useSelector(getLoginIsLoading);
	const error = useSelector(getLoginError);
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<LoginFormValues>({
		defaultValues: {
			usernameOrEmail: "",
			password: "",
		},
	});

	const onSubmit = handleSubmit(async (formData) => {
		if (isLoading) {
			return;
		}

		const result = await dispatch(loginByUsername(formData));

		if (loginByUsername.fulfilled.match(result)) {
			redirectAfterAuth(RoutePaths.main);
			return;
		}

		if (loginByUsername.rejected.match(result)) {
			const issues = getServerErrorIssues(result.payload);
			if (issues) {
				applyServerFieldErrors<LoginFormValues>(issues, normalizeIssueKey, setError);
			}
		}
	});

	return (
		<DynamicModuleLoader reducers={reducers}>
			<VStack
				as={Card}
				gap="m"
				className={className}
			>
				<VStack
					as="form"
					gap="s"
					max
					onSubmit={onSubmit}
				>
					<TextField
						name="usernameOrEmail"
						registration={register("usernameOrEmail", {
							required: "Поле обязательно для заполнения",
							minLength: {
								value: 2,
								message: "Минимум 2 символа",
							},
							maxLength: {
								value: 120,
								message: "Максимум 120 символов",
							},
						})}
						placeholder="Введите имя или email"
						error={errors.usernameOrEmail?.message}
					/>
					<TextField
						name="password"
						type="password"
						registration={register("password", {
							required: "Поле обязательно для заполнения",
							minLength: {
								value: 6,
								message: "Минимум 6 символов",
							},
							maxLength: {
								value: 100,
								message: "Максимум 100 символов",
							},
						})}
						placeholder="Введите пароль"
						error={errors.password?.message}
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
