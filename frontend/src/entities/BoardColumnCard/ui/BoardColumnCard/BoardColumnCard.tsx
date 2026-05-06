import { memo, type ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import type { BoardColumn } from "@/shared/types/board";
import { Card } from "@/shared/ui/Card/Card";
import cls from "./BoardColumnCard.module.scss";
import { HStack, VStack } from "@/shared/ui/Stack";
import { TextField } from "@/shared/ui/TextField/TextField";
import { Task } from "@/shared/ui/Task/Task";

interface BoardColumnCardProps {
	className?: string;
	columnData: BoardColumn;
	createTaskSlot?: ReactNode;
}

export const BoardColumnCard = memo((props: BoardColumnCardProps) => {
	const { columnData, className, createTaskSlot } = props;
	const { title, tasks } = columnData;
	console.log("tasks: ", tasks);

	return (
		<Card className={classNames(cls.boardColumnCard, {}, [className])}>
			<VStack gap="16">
				<HStack
					className={cls.header}
					justify="between"
					align="center"
					gap="4"
				>
					<TextField
						className={cls.clearTextField}
						size="s"
						value={title}
						theme="clear"
					/>

					<div className={cls.actions}>{/* TODO */}</div>
				</HStack>

				<VStack
					className={cls.tasks}
					gap="8"
					max
				>
					{tasks.map(({ id, title }) => (
						<Task
							key={id}
							className={cls.taskCard}
							text={title}
						/>
					))}
				</VStack>

				{createTaskSlot}
			</VStack>
		</Card>
	);
});
