import { memo, useCallback, useState } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import { appToast } from "@/shared/lib/toast";
import { getServerErrorMessage } from "@/shared/lib/serverError/serverError";
import { TextField } from "@/shared/ui/TextField/TextField";
import { Button } from "@/shared/ui/Button/Button";
import { useCreateTaskCommentMutation } from "@/entities/Comment";
import cls from "./CreateTaskComment.module.scss";

interface CreateTaskCommentProps {
	className?: string;
	taskId: string;
}

export const CreateTaskComment = memo((props: CreateTaskCommentProps) => {
	const { className, taskId } = props;
	const [commentContent, setCommentContent] = useState("");
	const [createTaskComment, { isLoading }] = useCreateTaskCommentMutation();

	const onCommentChange = useCallback((value: string) => {
		setCommentContent(value);
	}, []);

	const onCommentSubmit = useCallback(async () => {
		const normalizedComment = commentContent.trim();

		if (!normalizedComment) {
			appToast.error("Введите комментарий");
			return;
		}

		try {
			await createTaskComment({
				taskId,
				content: normalizedComment,
			}).unwrap();

			setCommentContent("");
			appToast.success("Комментарий добавлен");
		} catch (error) {
			appToast.error(getServerErrorMessage(error) ?? "Не удалось добавить комментарий");
		}
	}, [commentContent, createTaskComment, taskId]);

	return (
		<div className={classNames(cls.createTaskComment, {}, [className])}>
			<TextField
				as="textarea"
				value={commentContent}
				onChange={onCommentChange}
				placeholder="Добавьте комментарий..."
				rows={3}
			/>
			{commentContent.trim().length > 0 && (
				<Button
					theme="backgroundInverted"
					onClick={onCommentSubmit}
					disabled={isLoading}
				>
					Отправить
				</Button>
			)}
		</div>
	);
});
