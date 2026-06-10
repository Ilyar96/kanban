import { memo, Suspense, useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "./RequireAuth";
import type { AppRoutesProps } from "@/shared/types/router";
import { routeConfig } from "../config/routeConfig";
import { PageLoader } from "@/shared/ui/PageLoader/PageLoader";

export const AppRouter = memo(() => {
	const renderWithWrapper = useCallback((route: AppRoutesProps) => {
		const element = <Suspense fallback={<PageLoader />}>{route.element}</Suspense>;

		return (
			<Route
				key={route.path}
				path={route.path}
				element={
					route.authOnly ? <RequireAuth roles={route.roles}>{element}</RequireAuth> : element
				}
			/>
		);
	}, []);

	return <Routes>{Object.values(routeConfig).map(renderWithWrapper)}</Routes>;
});
