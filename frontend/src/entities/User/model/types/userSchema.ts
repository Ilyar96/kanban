import type { User } from "@/shared/types/auth";

export interface UserSchema {
	authData?: User;

	_inited: boolean;
}
