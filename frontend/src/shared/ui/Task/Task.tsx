import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import cls from "./Task.module.scss";
import { Button } from "../Button/Button";
import { SpriteIcon } from "../SpriteIcon/SpriteIcon";
import { HStack } from "../Stack";
import { Text } from "../Text/Text";
import { Popover } from "../Popover/Popover";

interface MutationPromise extends Promise<unknown> {
	abort: () => void;
	unwrap: () => Promise<unknown>;
}

interface TaskProps {
	className?: string;
	completed?: boolean;
	title: string;
	description?: string | null;
	onClickTask?: () => void;
	onToggleComplete?: () => MutationPromise;
}

export const Task = memo((props: TaskProps) => {
	const { className, completed, title, description, onClickTask, onToggleComplete } = props;
	const [localCompleted, setLocalCompleted] = useState(completed);

	const completedRef = useRef(completed);
	const requestRef = useRef<MutationPromise | null>(null);

	useEffect(() => {
		completedRef.current = completed;
		setLocalCompleted(completed);
	}, [completed]);

	useEffect(() => {
		return () => {
			requestRef.current?.abort();
		};
	}, []);

	const handleComplete = useCallback(async () => {
		const previous = completedRef.current;
		const next = !previous;

		completedRef.current = next;
		setLocalCompleted(next);

		requestRef.current?.abort();

		const request = onToggleComplete?.();

		if (!request) {
			return;
		}

		requestRef.current = request;

		try {
			await request.unwrap();
		} catch (error: unknown) {
			if (error instanceof Error && error.name === "AbortError") {
				return;
			}

			completedRef.current = previous;
			setLocalCompleted(previous);
		} finally {
			if (requestRef.current === request) {
				requestRef.current = null;
			}
		}
	}, [onToggleComplete]);

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
				onClick={handleComplete}
			>
				{localCompleted ? (
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
				<Text className={classNames(cls.taskTitle, { [cls.completedText]: localCompleted }, [])}>
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
