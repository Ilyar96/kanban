import type { ServerErrorPayload } from "@/shared/types/serverError";

export interface RegisterSchema {
	username: string;
	email: string;
	password: string;
	isLoading: boolean;
	error?: string | ServerErrorPayload;
}
