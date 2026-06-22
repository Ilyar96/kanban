import { BoardDetailPage } from "@/pages/BoardDetailPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { WorkspacePage } from "@/pages/WorkspacePage";
import { RoutePaths } from "@/shared/const/router";
import type { AppRoutes } from "@/shared/const/router";
import type { AppRoutesProps } from "@/shared/types/router";

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
	main: {
		path: RoutePaths.main,
		element: <WorkspacePage />,
		authOnly: true,
	},
	register: {
		path: RoutePaths.register,
		element: <RegisterPage />,
	},
	login: {
		path: RoutePaths.login,
		element: <LoginPage />,
	},
	board: {
		path: RoutePaths.board + "/:boardId",
		element: <BoardDetailPage />,
		authOnly: true,
	},

	forbidden: {
		path: RoutePaths.forbidden,
		element: <div>Forbidden</div>,
	},

	not_found: {
		path: RoutePaths.not_found,
		element: <NotFoundPage />,
	},
};
