import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./Task.module.scss";
import { Button } from "../Button/Button";
import { SpriteIcon } from "../SpriteIcon/SpriteIcon";
import { HStack } from "../Stack";
import { Text } from "../Text/Text";

interface TaskProps {
	className?: string;
	completed?: boolean;
	text: string;
	onClickTask?: () => void;
	onClickComplete?: () => void;
}

export const Task = memo((props: TaskProps) => {
	const { className, completed, text, onClickTask, onClickComplete } = props;

	return (
		<HStack
			align="center"
			max
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
				<Text className={classNames("", { [cls.completedText]: completed }, [])}>{text}</Text>
			</Button>
		</HStack>
	);
});
