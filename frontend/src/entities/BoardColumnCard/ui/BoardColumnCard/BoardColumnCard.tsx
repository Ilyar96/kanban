import { memo, type ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import type { BoardColumn, Task as TaskType } from "@/shared/types/board";
import { Card } from "@/shared/ui/Card/Card";
import cls from "./BoardColumnCard.module.scss";
import { VStack } from "@/shared/ui/Stack";
import { TextField } from "@/shared/ui/TextField/TextField";
import { TaskList } from "../TaskList/TaskList";

interface BoardColumnCardProps {
	className?: string;
	columnData: BoardColumn;
	tasks?: TaskType[];
	createTaskSlot?: ReactNode;
	headerSlot?: ReactNode;
	renderTask?: (task: TaskType) => ReactNode;
	activeTaskId?: string | null;
}

export const BoardColumnCard = memo((props: BoardColumnCardProps) => {
	const {
		columnData,
		tasks: tasksOverride,
		className,
		createTaskSlot,
		headerSlot,
		renderTask,
		activeTaskId,
	} = props;
	const { title, id: columnId, tasks: columnTasks } = columnData;
	const tasks = tasksOverride ?? columnTasks;

	return (
		<Card className={classNames(cls.boardColumnCard, {}, [className])}>
			<VStack gap="l">
				{headerSlot ? (
					headerSlot
				) : (
					<TextField
						className={cls.clearTextField}
						fieldSize="m"
						value={title}
						theme="clear"
						readonly
					/>
				)}

				<TaskList
					tasks={tasks}
					columnId={columnId}
					renderTask={renderTask}
					activeTaskId={activeTaskId}
				/>

				{createTaskSlot}
			</VStack>
		</Card>
	);
});
