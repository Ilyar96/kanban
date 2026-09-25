import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ThunkConfig } from "@/app/providers/StoreProvider";
import { authChannel } from "@/shared/lib/authChannel/authChannel";
import { userActions } from "../../slice/userSlice";

export const logoutUser = createAsyncThunk<void, void, ThunkConfig<string>>(
	"user/logoutUser",
	async (_, { dispatch }) => {
		dispatch(userActions.logout());
		authChannel.postMessage("logout");
	},
);
