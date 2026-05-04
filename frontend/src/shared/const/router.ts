export type AppRoutes = "main" | "register" | "login" | "board" | "forbidden" | "not_found";

export const RoutePaths: Record<AppRoutes, string> = {
	main: "/",
	register: "/register",
	login: "/login",
	board: "/board",
	forbidden: "/forbidden",

	not_found: "*",
};
