export type UserRole = "user" | "manager" | "admin";

export interface User {
	id: string;
	username: string;
	roles: UserRole[];
}
