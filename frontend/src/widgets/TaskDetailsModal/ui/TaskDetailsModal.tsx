import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./TaskDetailsModal.module.scss";
import { Modal } from "@/shared/ui/Modal/Modal";
import { UpdateTask } from "@/features/Task";
import type { Task } from "@/shared/types/board";

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
			isOpen={isOpen}
			onClose={onClose}
			onCancel={onClose}
			cancelBtnText="Закрыть"
		>
			<div className={classNames(cls.taskDetailsModal, {}, [className])}>
				{task && (
					<UpdateTask
						boardId={boardId}
						task={task}
					/>
				)}
			</div>
		</Modal>
	);
});
