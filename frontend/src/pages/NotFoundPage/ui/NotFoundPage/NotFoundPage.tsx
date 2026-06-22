import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import cls from "./NotFoundPage.module.scss";
import { Text } from "@/shared/ui/Text/Text";
import { Button } from "@/shared/ui/Button/Button";
import { RoutePaths } from "@/shared/const/router";
import { Page } from "@/shared/ui/Page/Page";

interface NotFoundPageProps {
	className?: string;
}

const NotFoundPage = memo(({ className }: NotFoundPageProps) => {
	const navigate = useNavigate();

	const onBackHome = useCallback(() => {
		navigate(RoutePaths.main);
	}, [navigate]);

	return (
		<Page
			className={classNames(cls.notFoundPage, {}, [className])}
			centered
		>
			<div className={cls.glow} />
			<div className={cls.content}>
				<span className={cls.code}>404</span>
				<Text
					className={cls.title}
					title="Страница не найдена"
					size="l"
					align="center"
				/>
				<Text
					className={cls.subtitle}
					text="Похоже, ссылка устарела или страница была перемещена."
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

export default NotFoundPage;
