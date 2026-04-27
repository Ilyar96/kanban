export type UserRole = "USER" | "EDITOR" | "ADMIN";

export interface User {
	id: string;
	username: string;
	email: string;
	roles: UserRole[];
}
