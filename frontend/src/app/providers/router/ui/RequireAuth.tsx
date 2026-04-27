import { useMemo, type JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { getUserAuthData, getUserInited, getUserRoles } from "@/entities/User";
import { RoutePaths } from "@/shared/const/router";
import type { UserRole } from "@/shared/types/auth";

interface RequireAuthProps {
	children: JSX.Element;
	roles?: UserRole[];
}

export const RequireAuth = (props: RequireAuthProps) => {
	const { children, roles } = props;
	const auth = useSelector(getUserAuthData);
	const isInited = useSelector(getUserInited);
	const location = useLocation();
	const userRoles = useSelector(getUserRoles);

	const hasRequiredRoles = useMemo(() => {
		if (!roles) return true;
		return roles.some((role) => userRoles.includes(role));
	}, [roles, userRoles]);

	if (!isInited) {
		return null;
	}

	if (!auth) {
		return (
			<Navigate
				to={RoutePaths.login}
				state={{ from: location }}
				replace
			/>
		);
	}

	if (!hasRequiredRoles) {
		return (
			<Navigate
				to={RoutePaths.forbidden}
				state={{ from: location }}
				replace
			/>
		);
	}

	return children;
};
