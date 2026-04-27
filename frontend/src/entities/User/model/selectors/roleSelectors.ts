import type { StateSchema } from "@/app/providers/StoreProvider";

export const getUserRoles = (state: StateSchema) => state.user.authData?.roles || [];

export const getIsAdmin = (state: StateSchema) => getUserRoles(state).includes("ADMIN");
export const getIsEditor = (state: StateSchema) => getUserRoles(state).includes("EDITOR");
