import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import { useGetBoardsDetailsQuery } from "../../model/api/boardsDetailsApi";
import { HStack, VStack } from "@/shared/ui/Stack";
import { useParams } from "react-router-dom";
import { ColumnList } from "../ColumnList/ColumnList";
import type { Task } from "@/shared/types/board";
import cls from "./BoardDetails.module.scss";
import { BoardDetailsHeader } from "../BoardDetailsHeader/BoardDetailsHeader";

interface BoardDetailsProps {
	className?: string;
	onTaskClick?: (task: Task) => void;
}

export const BoardDetails = memo((props: BoardDetailsProps) => {
	const { className, onTaskClick } = props;
	const { boardId } = useParams<{ boardId: string }>();
	const { data, error, isLoading } = useGetBoardsDetailsQuery(boardId);

	const canEdit = true; // TODO: permissions

	if (!boardId) {
		return null;
	}

	if (error) {
		return (
			<div className={classNames(cls.boardDetails, {}, [className])}>
				Ошибка загрузки данных
				{/* todo */}
			</div>
		);
	}

	if (isLoading || !data) {
		return (
			<div className={classNames(cls.boardDetails, {}, [className])}>
				Загрузка...
				{/* todo */}
			</div>
		);
	}

	return (
		<VStack
			className={cls.wrapper}
			gap="16"
			style={{ background: data.board.backgroundColor }}
		>
			<BoardDetailsHeader />
			<HStack
				gap="16"
				className={classNames(cls.boardDetails, {}, [className])}
			>
				<ColumnList
					boardId={boardId}
					columns={data.board.columns ?? []}
					canEdit={canEdit}
					onTaskClick={onTaskClick}
				/>
			</HStack>
		</VStack>
	);
});
