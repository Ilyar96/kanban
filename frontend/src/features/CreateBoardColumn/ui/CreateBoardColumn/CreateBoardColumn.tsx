import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback, useRef, useState } from "react";
import cls from "./CreateBoardColumn.module.scss";
import { Button } from "@/shared/ui/Button/Button";
import { SpriteIcon } from "@/shared/ui/SpriteIcon/SpriteIcon";
import { CreateItemForm } from "@/shared/ui/CreateItemForm/CreateItemForm";
import { useClickOutside } from "@/shared/lib/hooks/useClickOutside/useClickOutside";
import { useCreateBoardColumnMutation } from "../../model/api/createBoardColumnApi";
import { appToast } from "@/shared/lib/toast";

interface CreateBoardColumnProps {
	className?: string;
	boardId: string;
	noColumns?: boolean;
}

export const CreateBoardColumn = memo((props: CreateBoardColumnProps) => {
	const { boardId, className, noColumns } = props;
	const [value, setValue] = useState("");
	const [isFormVisible, setIsFormVisible] = useState(false);
	const ref = useRef(null);

	const [createBoard] = useCreateBoardColumnMutation();

	const onSubmit = useCallback(() => {
		if (!value.trim()) return;

		try {
			createBoard({ boardId, title: value.trim() });
			setValue("");
			setIsFormVisible(false);
			appToast.success("Колонка успешно создана");
		} catch (error) {
			console.error("Failed to create board column", error);
			appToast.error("Не удалось создать колонку");
		}
	}, [value, createBoard, boardId]);

	const onClickCreate = useCallback(() => {
		setIsFormVisible(true);
	}, []);

	const onCancelCreate = useCallback(() => {
		setIsFormVisible(false);
		setValue("");
	}, []);

	useClickOutside({ ref, handler: onCancelCreate });

	return (
		<div
			className={classNames(cls.createBoardColumn, {}, [className])}
			ref={ref}
		>
			{!isFormVisible ? (
				<Button onClick={onClickCreate}>
					<SpriteIcon
						className={cls.plusIcon}
						spriteId="icon-plus"
					/>
					<span>{noColumns ? "Добавьте первую колонку" : "Добавьте еще одну колонку"}</span>
				</Button>
			) : (
				<CreateItemForm
					className={cls.createForm}
					value={value}
					onChange={setValue}
					onCancel={onCancelCreate}
					onSubmit={onSubmit}
					placeholder="Введите имя колонки..."
					isCard
					btnText="Добавить колонку"
					autoFocus
					isBtnDisabled={!value.trim()}
				/>
			)}
		</div>
	);
});
