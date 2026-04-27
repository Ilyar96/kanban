export type AppRoutes = "main" | "register" | "login" | "forbidden" | "not_found";

export const RoutePaths: Record<AppRoutes, string> = {
	main: "/",
	register: "/register",
	login: "/login",
	forbidden: "/forbidden",

	not_found: "*",
};
