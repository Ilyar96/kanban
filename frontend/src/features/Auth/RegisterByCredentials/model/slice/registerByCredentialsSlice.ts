import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RegisterSchema } from "../types/registerSchema";
import { registerByCredentials } from "../services/registerByCredentials/registerByCredentials";

const initialState: RegisterSchema = {
	username: "",
	email: "",
	password: "",
	isLoading: false,
};

const registerSlice = createSlice({
	name: "register",
	initialState,
	reducers: {
		setUsername: (state, action: PayloadAction<string>) => {
			state.username = action.payload;
		},
		setEmail: (state, action: PayloadAction<string>) => {
			state.email = action.payload;
		},
		setPassword: (state, action: PayloadAction<string>) => {
			state.password = action.payload;
		},
		setIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setError: (state, action: PayloadAction<string | RegisterSchema["error"]>) => {
			state.error = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registerByCredentials.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(registerByCredentials.fulfilled, (state) => {
				state.isLoading = false;
				state.username = "";
				state.email = "";
				state.password = "";
			})
			.addCase(registerByCredentials.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

export const { actions: registerActions, reducer: registerReducer } = registerSlice;
