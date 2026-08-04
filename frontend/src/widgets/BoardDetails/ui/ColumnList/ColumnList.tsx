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
	type DragOverEvent,
	type DragCancelEvent,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import type { BoardColumn, Task as TaskType } from "@/shared/types/board";
import { HStack } from "@/shared/ui/Stack";
import { useOptimisticSortable } from "@/shared/lib/hooks/useOptimisticSortable/useOptimisticSortable";
import { useOptimisticTaskColumns } from "@/shared/lib/hooks/useOptimisticTaskColumns/useOptimisticTaskColumns";
import { SortableColumn } from "@/shared/ui/SortableColumn/SortableColumn";
import { BoardColumnCard } from "@/entities/BoardColumnCard";
import { CreateBoardColumn } from "@/features/CreateBoardColumn";
import { CreateTask, useMoveTaskMutation, useToggleTaskCompletedMutation } from "@/features/Task";
import { useMoveBoardColumnMutation } from "@/features/BoardColumn";
import { Task } from "@/shared/ui/Task/Task";
import { appToast } from "@/shared/lib/toast";
import { ColumnHeader } from "../ColumnHeader/ColumnHeader";
import cls from "./ColumnList.module.scss";

// TODO починить dnd колонок

interface ColumnListProps {
	boardId: string;
	columns: BoardColumn[];
	canEdit?: boolean;
	onTaskClick?: (task: TaskType) => void;
}

function isColumnDrag(event: { active: { data: { current?: unknown } } }): boolean {
	return (event.active.data.current as { type?: string } | undefined)?.type === "column";
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

	const handlePersistTaskMove = useCallback(
		async ({
			taskId,
			targetColumnId,
			targetPosition,
		}: {
			taskId: string;
			sourceColumnId: string;
			targetColumnId: string;
			targetPosition: number;
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

	const taskDnd = useOptimisticTaskColumns({
		columns: sourceColumns,
		onPersistMove: handlePersistTaskMove,
		onPersistError: () => {
			appToast.error("Не удалось переместить карточку");
		},
	});

	const { items: columns, onDragEnd: onColumnDragEnd } = useOptimisticSortable({
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

	const handleDragStart = useCallback(
		(event: DragStartEvent) => {
			if (isColumnDrag(event)) {
				setActiveColumnId(String(event.active.id));
				return;
			}

			taskDnd.onDragStart(event);
		},
		[taskDnd],
	);

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			if (isColumnDrag(event)) {
				return;
			}

			taskDnd.onDragOver(event);
		},
		[taskDnd],
	);

	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			if (isColumnDrag(event)) {
				setActiveColumnId(null);
				await onColumnDragEnd(event);
				return;
			}

			await taskDnd.onDragEnd(event);
		},
		[onColumnDragEnd, taskDnd],
	);

	const handleDragCancel = useCallback(
		(event: DragCancelEvent) => {
			if (isColumnDrag(event)) {
				setActiveColumnId(null);
				return;
			}

			taskDnd.onDragCancel(event);
		},
		[taskDnd],
	);

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
	const activeTaskId = taskDnd.activeTask?.id ?? null;

	return (
		<HStack gap="l">
			{columns.length > 0 && (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
					onDragCancel={handleDragCancel}
				>
					<SortableContext
						items={columns.map((c) => c.id)}
						strategy={horizontalListSortingStrategy}
					>
						<HStack gap="l">
							{columns.map((column) => (
								<SortableColumn
									key={column.id}
									id={column.id}
									data={{ type: "column", columnId: column.id }}
									isGhost={activeColumnId === column.id}
								>
									<BoardColumnCard
										columnData={column}
										tasks={taskDnd.getColumnTasks(column.id)}
										createTaskSlot={renderCreateTask(column.id)}
										headerSlot={renderColumnHeader(column)}
										renderTask={renderColumnTask}
										activeTaskId={activeTaskId}
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
									tasks={taskDnd.getColumnTasks(activeColumn.id)}
									createTaskSlot={renderCreateTask(activeColumn.id)}
									headerSlot={renderColumnHeader(activeColumn)}
									renderTask={renderOverlayTask}
								/>
							</div>
						) : taskDnd.activeTask ? (
							<div className={cls.dragOverlayTask}>
								<Task
									title={taskDnd.activeTask.title}
									description={taskDnd.activeTask.description}
									completed={taskDnd.activeTask.completed}
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
