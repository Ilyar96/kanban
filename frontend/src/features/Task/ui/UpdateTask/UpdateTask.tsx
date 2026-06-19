import { classNames } from "@/shared/lib/classNames/classNames";
import { appToast } from "@/shared/lib/toast";
import type { Task } from "@/shared/types/board";
import { CreateItemForm } from "@/shared/ui/CreateItemForm/CreateItemForm";
import { memo, useCallback, useEffect, useState } from "react";
import { useUpdateTaskMutation } from "../../model/api/updateTaskApi";
import { getServerErrorMessage } from "@/shared/lib/serverError/serverError";
import cls from "./UpdateTask.module.scss";

interface UpdateTaskProps {
	className?: string;
	boardId: string;
	task: Task;
}

export const UpdateTask = memo((props: UpdateTaskProps) => {
	const { className, boardId, task } = props;
	const [title, setTitle] = useState(task.title ?? "");
	const [description, setDescription] = useState(task.description ?? "");
	const [updateTask, { isLoading }] = useUpdateTaskMutation();

	const onTitleChange = useCallback((value: string) => {
		setTitle(value);
	}, []);

	const onDescriptionChange = useCallback((value: string) => {
		setDescription(value);
	}, []);

	useEffect(() => {
		setTitle(task.title ?? "");
		setDescription(task.description ?? "");
	}, [task.description, task.id, task.title]);

	const onCancel = useCallback(() => {
		setTitle(task.title ?? "");
		setDescription(task.description ?? "");
	}, [task.description, task.title]);

	const onSubmit = useCallback(async () => {
		const normalizedTitle = title.trim();
		const normalizedDescription = description.trim();

		if (!normalizedTitle) {
			appToast.error("Введите название карточки");
			return;
		}

		try {
			await updateTask({
				boardId,
				taskId: task.id,
				title: normalizedTitle,
				description: normalizedDescription,
			}).unwrap();

			appToast.success("Карточка успешно обновлена");
		} catch (error) {
			appToast.error(getServerErrorMessage(error) ?? "Не удалось обновить карточку");
		}
	}, [boardId, description, task.id, title, updateTask]);

	return (
		<div className={classNames(cls.updateTask, {}, [className])}>
			<CreateItemForm
				btnText={"Сохранить"}
				titleFieldType="input"
				title={title}
				description={description}
				onTitleChange={onTitleChange}
				onDescriptionChange={onDescriptionChange}
				onSubmit={onSubmit}
				onCancel={onCancel}
				cancelBtnText="Отменить"
				titlePlaceholder="Введите название карточки..."
				descriptionPlaceholder="Введите описание карточки..."
				isBtnDisabled={isLoading}
			/>
		</div>
	);
});
