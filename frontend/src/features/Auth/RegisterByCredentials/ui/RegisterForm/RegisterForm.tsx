import { memo } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch/useAppDispatch";
import { useSelector } from "react-redux";
import { useAuthRedirect } from "@/shared/lib/hooks/useAuthRedirect/useAuthRedirect";
import { registerByCredentials } from "../../model/services/registerByCredentials/registerByCredentials";
import { registerReducer } from "../../model/slice/registerByCredentialsSlice";
import { VStack } from "@/shared/ui/Stack";
import { Card } from "@/shared/ui/Card/Card";
import { TextField } from "@/shared/ui/TextField/TextField";
import { Button } from "@/shared/ui/Button/Button";
import { Text } from "@/shared/ui/Text/Text";
import { AppLink } from "@/shared/ui/AppLink/AppLink";
import { RoutePaths } from "@/shared/const/router";
import { getRegisterIsLoading } from "../../model/selectors/getRegisterIsLoading/getRegisterIsLoading";
import { getRegisterError } from "../../model/selectors/getRegisterError/getRegisterError";
import type { ServerErrorPayload } from "@/shared/types/serverError";
import {
	DynamicModuleLoader,
	type ReducersList,
} from "@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { classNames } from "@/shared/lib/classNames/classNames";

interface RegisterFormProps {
	className?: string;
}

const reducers: ReducersList = {
	registerForm: registerReducer,
};

interface RegisterFormValues {
	username: string;
	email: string;
	password: string;
}

const isServerErrorPayload = (error: unknown): error is ServerErrorPayload => {
	if (!error || typeof error !== "object") {
		return false;
	}

	const candidate = error as Partial<ServerErrorPayload>;
	return Boolean(candidate.issues && typeof candidate.issues === "object");
};

const normalizeIssueKey = (key: string): keyof RegisterFormValues | null => {
	const cleanKey = key.includes(".") ? (key.split(".").at(-1) ?? key) : key;

	if (cleanKey === "username" || cleanKey === "email" || cleanKey === "password") {
		return cleanKey;
	}

	return null;
};

export const RegisterForm = memo(({ className }: RegisterFormProps) => {
	const dispatch = useAppDispatch();
	const { redirectAfterAuth } = useAuthRedirect();
	const isLoading = useSelector(getRegisterIsLoading);
	const error = useSelector(getRegisterError);
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<RegisterFormValues>({
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = handleSubmit(async (formData) => {
		if (isLoading) {
			return;
		}

		const result = await dispatch(registerByCredentials(formData));

		if (registerByCredentials.fulfilled.match(result)) {
			redirectAfterAuth(RoutePaths.main);
			return;
		}

		if (registerByCredentials.rejected.match(result) && isServerErrorPayload(result.payload)) {
			Object.entries(result.payload.issues).forEach(([key, message]) => {
				const fieldName = normalizeIssueKey(key);
				if (fieldName) {
					setError(fieldName, { type: "server", message });
				}
			});
		}
	});

	return (
		<DynamicModuleLoader reducers={reducers}>
			<VStack
				as={Card}
				gap="16"
				className={classNames("", {}, [className])}
			>
				<VStack
					as="form"
					gap="16"
					max
					onSubmit={onSubmit}
				>
					<TextField
						name="username"
						registration={register("username", {
							required: "Требуется имя пользователя",
							minLength: {
								value: 2,
								message: "Минимум 2 символа",
							},
							maxLength: {
								value: 80,
								message: "Максимум 80 символов",
							},
						})}
						placeholder="Введите имя"
						error={errors.username?.message}
					/>
					<TextField
						name="email"
						registration={register("email", {
							required: "Поле обязательно для заполнения",
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Неверный формат email",
							},
						})}
						placeholder="Введите email"
						error={errors.email?.message}
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
