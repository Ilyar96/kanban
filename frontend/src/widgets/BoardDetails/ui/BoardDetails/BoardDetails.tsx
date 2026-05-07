import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import { useGetBoardsDetailsQuery } from "../../model/api/boardsDetailsApi";
import { HStack } from "@/shared/ui/Stack";
import { BoardColumnCard } from "@/entities/BoardColumnCard";
import { CreateBoardColumn } from "@/features/CreateBoardColumn";
import { useParams } from "react-router-dom";
import { CreateTask } from "@/features/Task";
import { Task } from "@/shared/ui/Task/Task";
import { useToggleTaskCompletedMutation } from "@/features/Task";
import { ColumnHeader } from "./ColumnHeader/ColumnHeader";
import cls from "./BoardDetails.module.scss";

interface BoardDetailsProps {
	className?: string;
}

export const BoardDetails = memo((props: BoardDetailsProps) => {
	const { className } = props;
	const { boardId } = useParams<{ boardId: string }>();
	const { data, error, isLoading } = useGetBoardsDetailsQuery(boardId);
	const [toggle] = useToggleTaskCompletedMutation();
	const columns = data?.board?.columns || [];
	console.log("columns: ", columns);

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
								headerSlot={
									canEdit ? (
										<ColumnHeader
											column={column}
											boardId={boardId}
										/>
									) : undefined
								}
								renderTask={(task) => (
									<Task
										key={task.id}
										text={task.title}
										completed={task.completed}
										onClickComplete={() => toggle({ taskId: task.id, boardId })}
									/>
								)}
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
