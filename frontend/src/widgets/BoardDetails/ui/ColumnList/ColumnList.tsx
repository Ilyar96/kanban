import { memo, useCallback, useState } from "react";
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
import type { BoardColumn, Task as TaskType } from "@/shared/types/board";
import { HStack } from "@/shared/ui/Stack";
import { useOptimisticSortable } from "@/shared/lib/hooks/useOptimisticSortable/useOptimisticSortable";
import { SortableColumn } from "@/shared/ui/SortableColumn/SortableColumn";
import { BoardColumnCard } from "@/entities/BoardColumnCard";
import { CreateBoardColumn } from "@/features/CreateBoardColumn";
import { CreateTask, useMoveTaskMutation, useToggleTaskCompletedMutation } from "@/features/Task";
import { useMoveBoardColumnMutation } from "@/features/BoardColumn";
import { Task } from "@/shared/ui/Task/Task";
import { appToast } from "@/shared/lib/toast";
import { ColumnHeader } from "../ColumnHeader/ColumnHeader";
import cls from "./ColumnList.module.scss";

interface ColumnListProps {
	boardId: string;
	columns: BoardColumn[];
	canEdit?: boolean;
	onTaskClick?: (task: TaskType) => void;
}

export const ColumnList = memo((props: ColumnListProps) => {
	const { boardId, columns: sourceColumns, canEdit = true, onTaskClick } = props;
	const [moveTask] = useMoveTaskMutation();
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

	const handleMoveTask = useCallback(
		async ({
			taskId,
			targetPosition,
			targetColumnId,
		}: {
			taskId: string;
			targetPosition: number;
			targetColumnId: string;
		}) => {
			await moveTask({
				taskId,
				boardId,
				targetColumnId,
				targetPosition,
			}).unwrap();
		},
		[boardId, moveTask],
	);

	const { items: columns, onDragEnd } = useOptimisticSortable({
		sourceItems: sourceColumns,
		getId: getColumnId,
		getPosition: getColumnPosition,
		setPosition: setColumnPosition,
		onPersistMove: async ({ activeId, newIndex }) => {
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
			setActiveColumnId(null);
			await onDragEnd(event);
		},
		[onDragEnd],
	);

	const handleDragCancel = useCallback(() => {
		setActiveColumnId(null);
	}, []);

	const handleTaskClick = useCallback(
		(task: TaskType) => {
			onTaskClick?.(task);
		},
		[onTaskClick],
	);

	const renderColumnTask = useCallback(
		(task: TaskType) => (
			<Task
				key={task.id}
				title={task.title}
				description={task.description}
				completed={task.completed}
				onClickTask={() => handleTaskClick(task)}
				onToggleComplete={() => toggleTaskCompleted({ taskId: task.id, boardId })}
			/>
		),
		[boardId, handleTaskClick, toggleTaskCompleted],
	);

	const renderOverlayTask = useCallback(
		(task: TaskType) => (
			<Task
				key={task.id}
				title={task.title}
				description={task.description}
				completed={task.completed}
			/>
		),
		[],
	);

	const renderCreateTask = useCallback(
		(columnId: string) => (
			<CreateTask
				boardId={boardId}
				columnId={columnId}
			/>
		),
		[boardId],
	);

	const renderColumnHeader = useCallback(
		(column: BoardColumn) =>
			canEdit ? (
				<ColumnHeader
					column={column}
					boardId={boardId}
				/>
			) : undefined,
		[canEdit, boardId],
	);

	const activeColumn = activeColumnId
		? columns.find((column) => column.id === activeColumnId)
		: undefined;

	return (
		<HStack gap="16">
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
										onMoveTask={handleMoveTask}
										onMoveTaskError={() => appToast.error("Не удалось переместить карточку")}
										createTaskSlot={renderCreateTask(column.id)}
										headerSlot={renderColumnHeader(column)}
										renderTask={renderColumnTask}
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
									createTaskSlot={renderCreateTask(activeColumn.id)}
									headerSlot={renderColumnHeader(activeColumn)}
									renderTask={renderOverlayTask}
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
	);
});
