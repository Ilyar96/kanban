import { memo, useCallback, useState, type ReactNode } from "react";
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
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task as TaskType } from "@/shared/types/board";
import { useOptimisticSortable } from "@/shared/lib/hooks/useOptimisticSortable/useOptimisticSortable";
import { SortableColumn } from "@/shared/ui/SortableColumn/SortableColumn";
import { Task } from "@/shared/ui/Task/Task";
import { VStack } from "@/shared/ui/Stack";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./TaskList.module.scss";

interface TaskListProps {
	tasks: TaskType[];
	columnId: string;
	className?: string;
	renderTask?: (task: TaskType) => ReactNode;
	onMoveTask?: (params: {
		taskId: string;
		targetPosition: number;
		targetColumnId: string;
	}) => Promise<void>;
	onMoveTaskError?: (error: unknown) => void;
}

export const TaskList = memo((props: TaskListProps) => {
	const { tasks, columnId, className, renderTask, onMoveTask, onMoveTaskError } = props;
	const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 6 },
		}),
	);

	const getTaskId = useCallback((task: TaskType) => task.id, []);
	const getTaskPosition = useCallback((task: TaskType) => task.position, []);
	const setTaskPosition = useCallback(
		(task: TaskType, position: number) => ({
			...task,
			position,
		}),
		[],
	);

	const { items, onDragEnd } = useOptimisticSortable({
		sourceItems: tasks,
		getId: getTaskId,
		getPosition: getTaskPosition,
		setPosition: setTaskPosition,
		onPersistMove: async ({ activeId, newIndex }) => {
			if (!onMoveTask) {
				return;
			}

			await onMoveTask({
				taskId: activeId,
				targetPosition: newIndex,
				targetColumnId: columnId,
			});
		},
		onPersistError: onMoveTaskError,
	});

	const handleDragStart = useCallback((event: DragStartEvent) => {
		setActiveTaskId(String(event.active.id));
	}, []);

	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			try {
				await onDragEnd(event);
			} finally {
				setActiveTaskId(null);
			}
		},
		[onDragEnd],
	);

	const handleDragCancel = useCallback(() => {
		setActiveTaskId(null);
	}, []);

	const activeTask = activeTaskId ? items.find((task) => task.id === activeTaskId) : undefined;

	return (
		<div
			className={classNames(cls.taskList, {}, [className])}
			onPointerDown={(event) => event.stopPropagation()}
		>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragCancel={handleDragCancel}
			>
				<SortableContext
					items={items.map((task) => task.id)}
					strategy={verticalListSortingStrategy}
				>
					<VStack
						gap="8"
						max
					>
						{items.map((task) => (
							<SortableColumn
								key={task.id}
								id={task.id}
								isGhost={activeTaskId === task.id}
								className={cls.sortableTask}
							>
								{renderTask ? (
									renderTask(task)
								) : (
									<Task
										title={task.title}
										description={task.description}
										completed={task.completed}
									/>
								)}
							</SortableColumn>
						))}
					</VStack>
				</SortableContext>
				<DragOverlay>
					{activeTask ? (
						<div className={cls.sortableTask}>
							{renderTask ? (
								renderTask(activeTask)
							) : (
								<Task
									title={activeTask.title}
									description={activeTask.description}
									completed={activeTask.completed}
								/>
							)}
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
});
