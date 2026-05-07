import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback, useState } from "react";
import cls from "./CreateTask.module.scss";
import { Button } from "@/shared/ui/Button/Button";
import { SpriteIcon } from "@/shared/ui/SpriteIcon/SpriteIcon";
import { CreateItemForm } from "@/shared/ui/CreateItemForm/CreateItemForm";
import { useCreateTaskMutation } from "../../model/api/createTaskApi";
import { appToast } from "@/shared/lib/toast";
import { getServerErrorMessage } from "@/shared/lib/serverError/serverError";

interface CreateTaskProps {
	className?: string;
	boardId: string;
	columnId: string;
}

export const CreateTask = memo((props: CreateTaskProps) => {
	const { className, boardId, columnId } = props;
	const [title, setTitle] = useState("");
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [createTask] = useCreateTaskMutation();

	const btnText = "Добавить карточку";

	const onFormButtonClick = useCallback(() => {
		setIsFormVisible(true);
	}, []);

	const onFormButtonCancel = useCallback(() => {
		setIsFormVisible(false);
	}, []);

	const onChange = useCallback((value: string) => {
		setTitle(value);
	}, []);

	const onSubmit = useCallback(async () => {
		const normalizedTitle = title.trim();

		if (!normalizedTitle) {
			appToast.error("Введите название карточки");
			return;
		}

		try {
			await createTask({
				boardId,
				columnId,
				title: normalizedTitle,
			}).unwrap();

			setTitle("");
			setIsFormVisible(false);
			appToast.success("Карточка успешно создана");
		} catch (error) {
			appToast.error(getServerErrorMessage(error) ?? "Не удалось создать карточку");
		}
	}, [boardId, columnId, createTask, title]);

	return (
		<div className={classNames(cls.createTask, {}, [className])}>
			{!isFormVisible ? (
				<Button
					className={cls.btn}
					onClick={onFormButtonClick}
				>
					<SpriteIcon
						className={cls.plusIcon}
						spriteId="icon-plus"
					/>
					<span>{btnText}</span>
				</Button>
			) : (
				<CreateItemForm
					btnText={btnText}
					onCancel={onFormButtonCancel}
					fieldType="textarea"
					value={title}
					onChange={onChange}
					onSubmit={onSubmit}
					isBtnDisabled={!title.trim()}
				/>
			)}
		</div>
	);
});
