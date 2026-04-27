import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserSchema } from "../types/userSchema";
import { USER_TOKEN_KEY } from "@/shared/const/cookie";
import { removeCookie } from "@/shared/lib/cookies";
import type { User } from "@/shared/types/auth";
import { initAuthData } from "../services/initAuthData/initAuthData";

const initialState: UserSchema = {
	_inited: false,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setAuthData: (state, action: PayloadAction<User>) => {
			state.authData = action.payload;
		},
		setInited: (state) => {
			state._inited = true;
		},
		logout: (state) => {
			state.authData = undefined;
			removeCookie(USER_TOKEN_KEY);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(initAuthData.fulfilled, (state, action) => {
				if (action.payload) {
					state.authData = action.payload;
				}
			})
			.addMatcher(initAuthData.settled, (state) => {
				state._inited = true;
			});
	},
});

export const { actions: userActions, reducer: userReducer } = userSlice;
