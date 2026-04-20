import { useMemo, type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { RoutePaths } from "@/shared/const/router";
import type { UserRole } from "@/shared/types/auth";

interface RequireAuthProps {
	children: JSX.Element;
	roles?: UserRole[];
}

export const RequireAuth = (props: RequireAuthProps) => {
	const { children, roles } = props;
	// TODO: получить данные из стора
	const auth = null;
	const location = useLocation();
	const userRoles = useMemo(() => ["user"], []); // TODO: получить роли из стора

	const hasRequiredRoles = useMemo(() => {
		if (!roles) return true;
		return roles.some((role) => userRoles.includes(role));
	}, [roles, userRoles]);

	if (!auth) {
		return (
			<Navigate
				to={RoutePaths.register}
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
