import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useEffect } from "react";
import cls from "./BoardCard.module.scss";
import { Card } from "@/shared/ui/Card/Card";
import { Text } from "@/shared/ui/Text/Text";
import type { AppRoutes } from "@/shared/const/router";
import { useNavigate } from "react-router-dom";

interface BoardCardProps {
	className?: string;
	title?: string;
	background?: string;
	to?: AppRoutes;
}

export const BoardCard = memo((props: BoardCardProps) => {
	const { className, title, background, to } = props;
	const navigate = useNavigate();

	useEffect(() => {
		if (to) {
			navigate(to);
		}
	}, [to, navigate]);

	return (
		<Card className={classNames(cls.boardCard, { [cls.link]: to }, [className])}>
			<div
				className={cls.boardBackground}
				style={{ background }}
			/>
			<div className={cls.footer}>
				<Text
					title={title}
					size="s"
				/>
			</div>
		</Card>
	);
});
