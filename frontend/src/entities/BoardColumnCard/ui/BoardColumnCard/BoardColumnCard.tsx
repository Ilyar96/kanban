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
	createTaskSlot?: ReactNode;
	headerSlot?: ReactNode;
	renderTask?: (task: TaskType) => ReactNode;
	onMoveTask?: (params: {
		taskId: string;
		targetPosition: number;
		targetColumnId: string;
	}) => Promise<void>;
	onMoveTaskError?: (error: unknown) => void;
}

export const BoardColumnCard = memo((props: BoardColumnCardProps) => {
	const {
		columnData,
		className,
		createTaskSlot,
		headerSlot,
		renderTask,
		onMoveTask,
		onMoveTaskError,
	} = props;
	const { title, tasks } = columnData;

	return (
		<Card className={classNames(cls.boardColumnCard, {}, [className])}>
			<VStack gap="16">
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

				{tasks.length > 0 && (
					<TaskList
						tasks={tasks}
						columnId={columnData.id}
						renderTask={renderTask}
						onMoveTask={onMoveTask}
						onMoveTaskError={onMoveTaskError}
					/>
				)}

				{createTaskSlot}
			</VStack>
		</Card>
	);
});
