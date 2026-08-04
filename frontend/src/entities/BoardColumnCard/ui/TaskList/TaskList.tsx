import { memo, type ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task as TaskType } from "@/shared/types/board";
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
	activeTaskId?: string | null;
}

export const TaskList = memo((props: TaskListProps) => {
	const { tasks, columnId, className, renderTask, activeTaskId } = props;

	const { setNodeRef, isOver } = useDroppable({
		id: `dropzone-${columnId}`,
		data: { type: "column", columnId },
	});

	if (tasks.length === 0) {
		return null;
	}

	return (
		<div
			ref={setNodeRef}
			className={classNames(
				cls.taskList,
				{ [cls.taskListOver]: isOver, [cls.taskListEmpty]: tasks.length === 0 },
				[className],
			)}
			onPointerDown={(event) => event.stopPropagation()}
		>
			<SortableContext
				items={tasks.map((task) => task.id)}
				strategy={verticalListSortingStrategy}
			>
				<VStack
					gap="m"
					max
				>
					{tasks.map((task) => (
						<SortableColumn
							key={task.id}
							id={task.id}
							data={{ type: "task", columnId }}
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
					{tasks.length === 0 && <div className={cls.emptyPlaceholder} />}
				</VStack>
			</SortableContext>
		</div>
	);
});
