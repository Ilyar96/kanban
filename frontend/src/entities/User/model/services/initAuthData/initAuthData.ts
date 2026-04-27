import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import type { ThunkConfig } from "@/app/providers/StoreProvider";
import { USER_TOKEN_KEY } from "@/shared/const/cookie";
import { getCookie, removeCookie } from "@/shared/lib/cookies";
import type { User } from "@/shared/types/auth";

interface AuthMeResponse {
	user: User;
}

export const initAuthData = createAsyncThunk<User | undefined, void, ThunkConfig<string>>(
	"user/initAuthData",
	async (_, thunkApi) => {
		const { extra, rejectWithValue } = thunkApi;
		const token = getCookie(USER_TOKEN_KEY);

		if (!token) {
			return undefined;
		}

		try {
			const response = await extra.api.get<AuthMeResponse>("/auth/me");

			if (!response.data?.user) {
				throw new Error("No user in response");
			}

			return response.data.user;
		} catch (error) {
			removeCookie(USER_TOKEN_KEY);

			if (isAxiosError(error)) {
				return rejectWithValue(error.response?.data?.message ?? "Unauthorized");
			}

			return rejectWithValue("Unauthorized");
		}
	},
);
