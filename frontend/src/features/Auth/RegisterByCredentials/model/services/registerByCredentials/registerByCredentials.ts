import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import type { ThunkConfig } from "@/app/providers/StoreProvider";
import { userActions } from "@/entities/User";
import { setCookie } from "@/shared/lib/cookies";
import { USER_TOKEN_KEY } from "@/shared/const/cookie";
import type { User } from "@/shared/types/auth";
import type { ServerErrorPayload } from "@/shared/types/serverError";

interface RegisterByUsernameProps {
	username: string;
	email: string;
	password: string;
}

interface RegisterResponse {
	user: User;
	token: string;
}

export const registerByCredentials = createAsyncThunk<
	RegisterResponse,
	RegisterByUsernameProps,
	ThunkConfig<ServerErrorPayload | string>
>("register/registerByCredentials", async (authData, thunkApi) => {
	const { extra, dispatch, rejectWithValue } = thunkApi;

	try {
		const response = await extra.api.post<RegisterResponse>("/auth/register", authData);

		if (!response.data) {
			throw new Error();
		}

		setCookie(USER_TOKEN_KEY, response.data.token);
		dispatch(userActions.setAuthData(response.data.user));

		return response.data;
	} catch (e: unknown) {
		if (isAxiosError<ServerErrorPayload>(e) && e.response?.data) {
			return rejectWithValue(e.response.data);
		}

		console.log(e);
		return rejectWithValue("error");
	}
});
