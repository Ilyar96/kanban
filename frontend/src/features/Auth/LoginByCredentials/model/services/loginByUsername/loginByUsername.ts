import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import type { ThunkConfig } from "@/app/providers/StoreProvider";
import { userActions } from "@/entities/User";
import { setCookie } from "@/shared/lib/cookies";
import { USER_TOKEN_KEY } from "@/shared/const/cookie";
import type { User } from "@/shared/types/auth";
import type { ServerErrorPayload } from "@/shared/types/serverError";

interface LoginByUsernameProps {
	usernameOrEmail: string;
	password: string;
}

interface LoginResponse {
	user: User;
	token: string;
}

interface LoginBody {
	usernameOrEmail: string;
	password: string;
}

export const loginByUsername = createAsyncThunk<
	LoginResponse,
	LoginByUsernameProps,
	ThunkConfig<ServerErrorPayload | string>
>("login/loginByUsername", async (authData, thunkApi) => {
	const { extra, dispatch, rejectWithValue } = thunkApi;

	const body: LoginBody = {
		password: authData.password,
		usernameOrEmail: authData.usernameOrEmail,
	};

	try {
		const response = await extra.api.post<LoginResponse>("/auth/login", body);

		if (!response.data) {
			throw new Error();
		}

		setCookie(USER_TOKEN_KEY, response.data.token);
		dispatch(userActions.setAuthData(response.data.user));

		return response.data;
	} catch (e: unknown) {
		if (isAxiosError<ServerErrorPayload>(e) && e.response?.data?.issues) {
			return rejectWithValue(e.response.data);
		}

		console.log(e);
		return rejectWithValue("error");
	}
});
