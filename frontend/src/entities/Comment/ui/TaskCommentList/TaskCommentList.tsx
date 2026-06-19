import { memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { getUserId } from "@/entities/User";
import { classNames } from "@/shared/lib/classNames/classNames";
import { appToast } from "@/shared/lib/toast";
import { getServerErrorMessage } from "@/shared/lib/serverError/serverError";
import { Text } from "@/shared/ui/Text/Text";
import { useDeleteTaskCommentMutation, useGetTaskCommentsQuery } from "../../model/api/commentApi";
import { TaskComment } from "../TaskComment/TaskComment";
import cls from "./TaskCommentList.module.scss";

interface TaskCommentListProps {
	className?: string;
	taskId: string;
}

export const TaskCommentList = memo((props: TaskCommentListProps) => {
	const { className, taskId } = props;
	const userId = useSelector(getUserId);
	const { data: commentsData, isLoading: isCommentsLoading } = useGetTaskCommentsQuery({ taskId });
	const [deleteTaskComment, { isLoading: isDeleting }] = useDeleteTaskCommentMutation();

	const onDeleteComment = useCallback(
		async (commentId: string) => {
			try {
				await deleteTaskComment({ taskId, commentId }).unwrap();
				appToast.success("Комментарий удален");
			} catch (error) {
				appToast.error(getServerErrorMessage(error) ?? "Не удалось удалить комментарий");
			}
		},
		[deleteTaskComment, taskId],
	);

	const comments = commentsData?.comments ?? [];

	if (isCommentsLoading) {
		return <Text text="Загрузка комментариев..." />;
	}

	if (comments.length === 0) {
		return <Text text="Пока нет комментариев" />;
	}

	return (
		<div className={classNames(cls.taskCommentList, {}, [className])}>
			<ul className={cls.list}>
				{comments.map((comment) => (
					<TaskComment
						key={comment.id}
						comment={comment}
						canDelete={comment.authorId === userId}
						isDeleting={isDeleting}
						onDelete={onDeleteComment}
					/>
				))}
			</ul>
		</div>
	);
});
