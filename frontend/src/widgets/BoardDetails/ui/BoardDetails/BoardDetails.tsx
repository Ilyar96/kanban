import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import { useGetBoardsDetailsQuery } from "../../model/api/boardsDetailsApi";
import { HStack } from "@/shared/ui/Stack";
import { useParams } from "react-router-dom";
import { ColumnList } from "../ColumnList/ColumnList";
import cls from "./BoardDetails.module.scss";

interface BoardDetailsProps {
	className?: string;
}

export const BoardDetails = memo((props: BoardDetailsProps) => {
	const { className } = props;
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
		<HStack
			gap="16"
			className={classNames(cls.boardDetails, {}, [className])}
		>
			<ColumnList
				boardId={boardId}
				columns={data.board.columns ?? []}
				canEdit={canEdit}
			/>
		</HStack>
	);
});
