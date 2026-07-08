import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import cls from "./ForbiddenPage.module.scss";
import { Text } from "@/shared/ui/Text/Text";
import { Button } from "@/shared/ui/Button/Button";
import { RoutePaths } from "@/shared/const/router";
import { Seo } from "@/shared/lib/seo/Seo";
import { Page } from "@/shared/ui/Page/Page";

interface ForbiddenPageProps {
	className?: string;
}

const ForbiddenPage = memo(({ className }: ForbiddenPageProps) => {
	const navigate = useNavigate();

	const onBackHome = useCallback(() => {
		navigate(RoutePaths.main);
	}, [navigate]);

	return (
		<Page
			className={classNames(cls.forbiddenPage, {}, [className])}
			centered
		>
			<Seo
				title="Доступ запрещен"
				description="У вас нет доступа к этой странице Kanban."
				noindex
			/>
			<div className={cls.glow} />
			<div className={cls.content}>
				<span className={cls.code}>403</span>
				<Text
					className={cls.title}
					title="Доступ запрещен"
					size="l"
					align="center"
				/>
				<Text
					className={cls.subtitle}
					text="Похоже, у вас недостаточно прав для просмотра этой страницы."
					align="center"
					size="m"
				/>
				<Button
					className={cls.action}
					theme="backgroundInverted"
					onClick={onBackHome}
				>
					Вернуться на главную
				</Button>
			</div>
		</Page>
	);
});

export default ForbiddenPage;
