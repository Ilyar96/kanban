import { AuthFormWidget } from "@/widgets/AuthFormWidget";
import { memo } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUserAuthData, getUserInited } from "@/entities/User";
import { RoutePaths } from "@/shared/const/router";
import { useAuthRedirect } from "@/shared/lib/hooks/useAuthRedirect/useAuthRedirect";
import { Seo } from "@/shared/lib/seo/Seo";
import { Page } from "@/shared/ui/Page/Page";

const LoginPage = memo(() => {
	const authData = useSelector(getUserAuthData);
	const isInited = useSelector(getUserInited);
	const { getRedirectPath } = useAuthRedirect();

	if (!isInited) {
		return null;
	}

	if (authData) {
		return (
			<Navigate
				to={getRedirectPath(RoutePaths.main)}
				replace
			/>
		);
	}

	return (
		<Page centered>
			<Seo
				title="Вход"
				description="Войдите в Kanban, чтобы управлять задачами и рабочими пространствами."
			/>
			<AuthFormWidget type="login" />
		</Page>
	);
});

export default LoginPage;
