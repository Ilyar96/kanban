import { RoutePaths } from "@/shared/const/router";
import type { AppRoutes } from "@/shared/const/router";
import type { AppRoutesProps } from "@/shared/types/router";

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
	main: {
		path: RoutePaths.main,
		element: <div>Main page</div>,
		authOnly: true,
	},
	register: {
		path: RoutePaths.register,
		element: <div>Register page</div>,
	},
	login: {
		path: RoutePaths.login,
		element: <div>Login page</div>,
	},

	forbidden: {
		path: RoutePaths.forbidden,
		element: <div>Forbidden</div>,
	},

	not_found: {
		path: RoutePaths.not_found,
		element: <div>NotFound</div>,
	},
};
