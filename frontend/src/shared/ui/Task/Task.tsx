import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useState } from "react";
import cls from "./Task.module.scss";
import { Button } from "../Button/Button";
import { SpriteIcon } from "../SpriteIcon/SpriteIcon";
import { HStack } from "../Stack";

interface TaskProps {
	className?: string;
	checked?: boolean;
	text: string;
}

export const Task = memo((props: TaskProps) => {
	const { className, checked: checkedProp, text } = props;
	const [checked, setChecked] = useState(checkedProp ?? true);
	return (
		<HStack
			align="center"
			max
			className={classNames(cls.task, {}, [className])}
		>
			<Button
				className={cls.btn}
				fullWidth
			>
				{checked ? (
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
				{text}
			</Button>
		</HStack>
	);
});
