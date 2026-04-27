import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RoutePaths } from "@/shared/const/router";

type AuthRedirectState = {
	from?: {
		pathname?: string;
	};
} | null;

export const useAuthRedirect = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const getRedirectPath = useCallback(
		(fallbackPath: string = RoutePaths.main) => {
			const redirectPath = (location.state as AuthRedirectState)?.from?.pathname;
			return redirectPath || fallbackPath;
		},
		[location.state],
	);

	const redirectAfterAuth = useCallback(
		(fallbackPath: string = RoutePaths.main) => {
			navigate(getRedirectPath(fallbackPath), { replace: true });
		},
		[getRedirectPath, navigate],
	);

	return {
		getRedirectPath,
		redirectAfterAuth,
	};
};
