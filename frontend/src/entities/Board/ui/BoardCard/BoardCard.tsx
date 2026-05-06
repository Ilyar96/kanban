import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback, type KeyboardEvent, type MouseEvent } from "react";
import cls from "./BoardCard.module.scss";
import { Card } from "@/shared/ui/Card/Card";
import { Text } from "@/shared/ui/Text/Text";
import { useNavigate } from "react-router-dom";
import { BoardCardActions } from "../BoardCardActions/BoardCardActions";

interface BoardCardProps {
	className?: string;
	title?: string;
	background?: string;
	to?: string;
	id: string;
	isFavorite: boolean;
	onEditClick?: () => void;
}

export const BoardCard = memo((props: BoardCardProps) => {
	const { className, title, background, to, id, isFavorite, onEditClick } = props;
	const navigate = useNavigate();

	const onCardClick = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			if (!to) {
				return;
			}

			const target = event.target as HTMLElement;
			if (target.closest(`.${cls.boardCardActions}`)) {
				return;
			}

			navigate(to);
		},
		[navigate, to],
	);

	const onCardKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>) => {
			if (!to) {
				return;
			}

			const target = event.target as HTMLElement;
			if (target.closest(`.${cls.boardCardActions}`)) {
				return;
			}

			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				navigate(to);
			}
		},
		[navigate, to],
	);

	return (
		<Card
			className={classNames(cls.boardCard, { [cls.link]: to }, [className])}
			onClick={onCardClick}
			onKeyDown={onCardKeyDown}
			role={to ? "button" : undefined}
			tabIndex={to ? 0 : undefined}
		>
			<BoardCardActions
				className={cls.boardCardActions}
				boardId={id}
				isFavorite={isFavorite}
				onEditClick={onEditClick}
			/>
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
