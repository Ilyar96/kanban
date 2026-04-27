import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LoginSchema } from "../types/loginSchema";
import { loginByUsername } from "../services/loginByUsername/loginByUsername";
import type { ServerErrorPayload } from "@/shared/types/serverError";

const initialState: LoginSchema = {
	usernameOrEmail: "",
	password: "",
	isLoading: false,
};

const loginSlice = createSlice({
	name: "login",
	initialState,
	reducers: {
		setUsernameOrEmail: (state, action: PayloadAction<string>) => {
			state.usernameOrEmail = action.payload;
		},
		setPassword: (state, action: PayloadAction<string>) => {
			state.password = action.payload;
		},
		setIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setError: (state, action: PayloadAction<string | ServerErrorPayload>) => {
			state.error = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginByUsername.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(loginByUsername.fulfilled, (state) => {
				state.isLoading = false;
				state.usernameOrEmail = "";
				state.password = "";
			})
			.addCase(loginByUsername.rejected, (state, action) => {
				state.isLoading = false;
				// action.payload can be ServerErrorPayload or string
				state.error = action.payload as string | ServerErrorPayload;
			});
	},
});

export const { actions: loginActions, reducer: loginReducer } = loginSlice;
