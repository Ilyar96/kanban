export type AppRoutes = "main" | "register" | "login" | "forbidden" | "not_found";

export const RoutePaths: Record<AppRoutes, string> = {
	main: "/",
	register: "/signup",
	login: "/login",
	forbidden: "/forbidden",

	not_found: "*",
};
