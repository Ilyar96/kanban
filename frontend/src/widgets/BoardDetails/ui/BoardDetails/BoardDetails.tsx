import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./BoardDetails.module.scss";
import { useGetBoardsDetailsQuery } from "../../model/api/boardsDetailsApi";
import { HStack } from "@/shared/ui/Stack";
import { BoardColumnCard } from "@/entities/BoardColumnCard";
import { CreateBoardColumn } from "@/features/CreateBoardColumn";
import { useParams } from "react-router-dom";
import { CreateTask } from "@/features/CreateTask";
import { BoardColumnTitle } from "@/features/UpdateBoardColumn";

interface BoardDetailsProps {
	className?: string;
}

export const BoardDetails = memo((props: BoardDetailsProps) => {
	const { className } = props;
	const { boardId } = useParams<{ boardId: string }>();
	const { data, error, isLoading } = useGetBoardsDetailsQuery(boardId);
	const columns = data?.board?.columns || [];
	console.log("columns: ", columns);

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
		<>
			<HStack
				gap="16"
				className={classNames(cls.boardDetails, {}, [className])}
			>
				{columns.length > 0 && (
					<HStack
						gap="16"
						className={classNames(cls.boardDetails, {}, [className])}
					>
						{columns?.map((column) => (
							<BoardColumnCard
								key={column.id}
								columnData={column}
								createTaskSlot={
									<CreateTask
										boardId={boardId}
										columnId={column.id}
									/>
								}
								titleSlot={
									<BoardColumnTitle
										title={column.title}
										boardId={boardId}
										columnId={column.id}
									/>
								}
							/>
						))}
					</HStack>
				)}
				<CreateBoardColumn
					boardId={boardId}
					noColumns={columns.length === 0}
				/>
			</HStack>
		</>
	);
});
