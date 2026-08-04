import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./TaskDetailsModal.module.scss";
import { Modal } from "@/shared/ui/Modal/Modal";
import { UpdateTask } from "@/features/Task";
import type { Task } from "@/shared/types/board";
import { HStack } from "@/shared/ui/Stack";
import { CreateTaskComment } from "@/features/TaskComment";
import { TaskCommentList } from "@/entities/Comment";
import { Text } from "@/shared/ui/Text/Text";

interface TaskDetailsModalProps {
	className?: string;
	boardId: string;
	isOpen: boolean;
	task: Task | null;
	onClose: () => void;
}

export const TaskDetailsModal = memo((props: TaskDetailsModalProps) => {
	const { className, boardId, isOpen, task, onClose } = props;

	return (
		<Modal
			className={cls.taskDetailsModal}
			isOpen={isOpen}
			onClose={onClose}
			onCancel={onClose}
			cancelBtnText="Закрыть"
		>
			<div className={classNames(cls.taskDetailsModalInner, {}, [className])}>
				{task && (
					<HStack
						className={cls.content}
						gap="l"
					>
						<UpdateTask
							className={cls.editSection}
							boardId={boardId}
							task={task}
						/>
						<div className={cls.commentsSection}>
							<Text
								title="Комментарии"
								size="m"
							/>
							<CreateTaskComment taskId={task.id} />
							<TaskCommentList taskId={task.id} />
						</div>
					</HStack>
				)}
			</div>
		</Modal>
	);
});
