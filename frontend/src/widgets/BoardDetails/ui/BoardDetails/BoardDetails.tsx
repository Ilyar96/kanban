import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback, useState } from "react";
import { useGetBoardsDetailsQuery } from "../../model/api/boardsDetailsApi";
import { HStack } from "@/shared/ui/Stack";
import { BoardColumnCard } from "@/entities/BoardColumnCard";
import { CreateBoardColumn } from "@/features/CreateBoardColumn";
import { useParams } from "react-router-dom";
import { CreateTask } from "@/features/Task";
import { Task } from "@/shared/ui/Task/Task";
import { useToggleTaskCompletedMutation } from "@/features/Task";
import { ColumnHeader } from "../ColumnHeader/ColumnHeader";
import cls from "./BoardDetails.module.scss";

import {
	DndContext,
	DragOverlay,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	type DragStartEvent,
	type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { useMoveBoardColumnMutation } from "@/features/BoardColumn";
import { appToast } from "@/shared/lib/toast";
import { useOptimisticSortable } from "@/shared/lib/hooks/useOptimisticSortable/useOptimisticSortable";
import type { BoardColumn } from "@/shared/types/board";
import { SortableColumn } from "@/shared/ui/SortableColumn/SortableColumn";

interface BoardDetailsProps {
	className?: string;
}

export const BoardDetails = memo((props: BoardDetailsProps) => {
	const { className } = props;
	const { boardId } = useParams<{ boardId: string }>();
	const { data, error, isLoading } = useGetBoardsDetailsQuery(boardId);
	const [toggleTaskCompleted] = useToggleTaskCompletedMutation();
	const [moveBoardColumn] = useMoveBoardColumnMutation();
	const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
	);

	const getColumnId = useCallback((column: BoardColumn) => column.id, []);
	const getColumnPosition = useCallback((column: BoardColumn) => column.position, []);
	const setColumnPosition = useCallback(
		(column: BoardColumn, position: number) => ({
			...column,
			position,
		}),
		[],
	);

	const { items: columns, onDragEnd } = useOptimisticSortable({
		sourceItems: data?.board?.columns ?? [],
		getId: getColumnId,
		getPosition: getColumnPosition,
		setPosition: setColumnPosition,
		onPersistMove: async ({ activeId, newIndex }) => {
			if (!boardId) {
				return;
			}

			await moveBoardColumn({
				boardId,
				columnId: activeId,
				targetPosition: newIndex,
			}).unwrap();
		},
		onPersistError: () => {
			appToast.error("Не удалось переместить колонку");
		},
	});

	const handleDragStart = useCallback((event: DragStartEvent) => {
		setActiveColumnId(String(event.active.id));
	}, []);

	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			try {
				await onDragEnd(event);
			} finally {
				setActiveColumnId(null);
			}
		},
		[onDragEnd],
	);

	const handleDragCancel = useCallback(() => {
		setActiveColumnId(null);
	}, []);

	const activeColumn = activeColumnId
		? columns.find((column) => column.id === activeColumnId)
		: undefined;

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
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
						onDragCancel={handleDragCancel}
					>
						<SortableContext
							items={columns.map((c) => c.id)}
							strategy={horizontalListSortingStrategy}
						>
							<HStack gap="16">
								{columns.map((column) => (
									<SortableColumn
										key={column.id}
										id={column.id}
										isGhost={activeColumnId === column.id}
									>
										<BoardColumnCard
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
													onClickComplete={() => toggleTaskCompleted({ taskId: task.id, boardId })}
												/>
											)}
										/>
									</SortableColumn>
								))}
							</HStack>
						</SortableContext>
						<DragOverlay>
							{activeColumn ? (
								<div className={cls.dragOverlayColumn}>
									<BoardColumnCard
										columnData={activeColumn}
										renderTask={(task) => (
											<Task
												key={task.id}
												text={task.title}
												completed={task.completed}
											/>
										)}
									/>
								</div>
							) : null}
						</DragOverlay>
					</DndContext>
				)}
				<CreateBoardColumn
					boardId={boardId}
					noColumns={columns.length === 0}
				/>
			</HStack>
		</>
	);
});
