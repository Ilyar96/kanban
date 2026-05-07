import { memo, type ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import type { BoardColumn, Task as TaskType } from "@/shared/types/board";
import { Card } from "@/shared/ui/Card/Card";
import cls from "./BoardColumnCard.module.scss";
import { VStack } from "@/shared/ui/Stack";
import { TextField } from "@/shared/ui/TextField/TextField";
import { Task } from "@/shared/ui/Task/Task";

interface BoardColumnCardProps {
	className?: string;
	columnData: BoardColumn;
	createTaskSlot?: ReactNode;
	headerSlot?: ReactNode;
	renderTask?: (task: TaskType) => ReactNode;
}

export const BoardColumnCard = memo((props: BoardColumnCardProps) => {
	const { columnData, className, createTaskSlot, headerSlot, renderTask } = props;
	const { title, tasks } = columnData;
	console.log("tasks: ", tasks);

	return (
		<Card className={classNames(cls.boardColumnCard, {}, [className])}>
			<VStack gap="16">
				{headerSlot ? (
					headerSlot
				) : (
					<TextField
						className={cls.clearTextField}
						size="s"
						value={title}
						theme="clear"
						readonly
					/>
				)}

				<VStack
					className={cls.tasks}
					gap="8"
					max
				>
					{tasks.map((task) =>
						renderTask ? (
							renderTask(task)
						) : (
							<Task
								key={task.id}
								className={cls.taskCard}
								text={task.title}
							/>
						),
					)}
				</VStack>

				{createTaskSlot}
			</VStack>
		</Card>
	);
});
