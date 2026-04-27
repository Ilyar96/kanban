import type { ServerErrorPayload } from "@/shared/types/serverError";

export interface LoginSchema {
	usernameOrEmail: string;
	password: string;
	isLoading: boolean;
	error?: string | ServerErrorPayload;
}
