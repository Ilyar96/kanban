import type { StateSchema } from "@/app/providers/StoreProvider";

export const getUserAuthData = (state: StateSchema) => state.user.authData;
export const getIsUserAuth = (state: StateSchema) => !!state.user.authData;
export const getUserId = (state: StateSchema) => state.user.authData?.id;
