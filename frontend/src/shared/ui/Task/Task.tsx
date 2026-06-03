import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./Task.module.scss";
import { Button } from "../Button/Button";
import { SpriteIcon } from "../SpriteIcon/SpriteIcon";
import { HStack } from "../Stack";
import { Text } from "../Text/Text";
import { Popover } from "../Popover/Popover";

interface TaskProps {
	className?: string;
	completed?: boolean;
	title: string;
	description?: string | null;
	onClickTask?: () => void;
	onClickComplete?: () => void;
}

export const Task = memo((props: TaskProps) => {
	const { className, completed, title, description, onClickTask, onClickComplete } = props;

	const isIconWrapper = !!description;

	return (
		<HStack
			align="center"
			max
			gap="4"
			className={classNames(cls.taskWrapper, {}, [className])}
		>
			<Button
				className={cls.completeBtn}
				theme="clear"
				onClick={onClickComplete}
			>
				{completed ? (
					<>
						<SpriteIcon
							className={cls.icon}
							spriteId="task-checked"
						/>
						<span className="visually-hidden">Отметить как выполненное</span>
					</>
				) : (
					<>
						<SpriteIcon
							className={cls.icon}
							spriteId="task-unchecked"
						/>
						<span className="visually-hidden">Отметить как выполненное</span>
					</>
				)}
			</Button>
			<Button
				className={cls.taskBtn}
				fullWidth
				onClick={onClickTask}
			>
				<Text className={classNames(cls.taskTitle, { [cls.completedText]: completed }, [])}>
					{title}
				</Text>

				{isIconWrapper && (
					<HStack className={cls.iconsWrapper}>
						{description && (
							<>
								<Popover
									trigger={
										<SpriteIcon
											spriteId="task-with-description"
											className={cls.descriptionIcon}
										/>
									}
									size="s"
									openOnHover
								>
									<Text size="xs">Эта карточка с описанием</Text>
								</Popover>
							</>
						)}
					</HStack>
				)}
			</Button>
		</HStack>
	);
});
