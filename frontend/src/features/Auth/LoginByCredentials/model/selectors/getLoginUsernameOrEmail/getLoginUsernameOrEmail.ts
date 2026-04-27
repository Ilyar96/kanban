import type { StateSchema } from "@/app/providers/StoreProvider";

export const getLoginUsernameOrEmail = (state: StateSchema) =>
	state?.loginForm?.usernameOrEmail || "";
