import { memo, useCallback, useState } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import { Button } from "@/shared/ui/Button/Button";
import { Modal } from "@/shared/ui/Modal/Modal";
import { Text } from "@/shared/ui/Text/Text";
import type { Comment } from "../../model/types/comment";
import cls from "./TaskComment.module.scss";
import { HStack, VStack } from "@/shared/ui/Stack";

interface TaskCommentProps {
	className?: string;
	comment: Comment;
	canDelete?: boolean;
	isDeleting?: boolean;
	onDelete?: (commentId: string) => Promise<void>;
}

export const TaskComment = memo((props: TaskCommentProps) => {
	const { className, comment, canDelete, isDeleting, onDelete } = props;
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

	const openDeleteModal = useCallback(() => {
		if (!canDelete) return;
		setDeleteModalOpen(true);
	}, [canDelete]);

	const closeDeleteModal = useCallback(() => {
		if (isDeleting) return;
		setDeleteModalOpen(false);
	}, [isDeleting]);

	const onConfirmDelete = useCallback(async () => {
		if (!onDelete || isDeleting) return;

		await onDelete(comment.id);
		setDeleteModalOpen(false);
	}, [comment.id, isDeleting, onDelete]);

	return (
		<>
			<VStack
				className={classNames(cls.taskComment, {}, [className])}
				gap="s"
			>
				<HStack
					className={cls.meta}
					align="center"
					justify="between"
					gap="m"
					max
				>
					<span className={cls.authorName}>{comment.author.name}</span>
					<span className={cls.createdAt}>
						{new Date(comment.createdAt).toLocaleString("ru-RU")}
					</span>
				</HStack>

				<Text text={comment.content} />

				{canDelete && (
					<HStack
						className={cls.actions}
						justify="end"
						max
					>
						<Button
							theme="outline_red"
							size="s"
							onClick={openDeleteModal}
							disabled={isDeleting}
						>
							Удалить
						</Button>
					</HStack>
				)}
			</VStack>

			<Modal
				title="Удалить комментарий?"
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onCancel={closeDeleteModal}
				onConfirm={onConfirmDelete}
				confirmBtnText={isDeleting ? "Удаляем..." : "Удалить"}
				cancelBtnText="Отмена"
				confirmDisabled={isDeleting}
				cancelDisabled={isDeleting}
			>
				<Text
					theme="error"
					text="Это действие нельзя отменить."
				/>
			</Modal>
		</>
	);
});
