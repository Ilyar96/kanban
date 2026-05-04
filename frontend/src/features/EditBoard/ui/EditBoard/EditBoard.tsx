import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback, useEffect, useMemo, type ReactNode } from "react";
import cls from "./EditBoard.module.scss";
import type { Board } from "@/shared/types/board";
import { appToast } from "@/shared/lib/toast";
import { Modal } from "@/shared/ui/Modal/Modal";
import {
	BoardForm,
	type BoardFormInitialValues,
	type BoardFormSubmitValues,
} from "@/entities/Board";
import { useUpdateBoardMutation } from "../../model/api/editBoardApi";

interface EditBoardProps {
	className?: string;
	board: Board;
	trigger?: ReactNode;
	isOpen?: boolean;
	onClose?: () => void;
}

export const EditBoard = memo((props: EditBoardProps) => {
	const { className, board, trigger, isOpen, onClose } = props;
	const [updateBoard, { isLoading, error }] = useUpdateBoardMutation();
	const isControlled = typeof isOpen === "boolean";

	const errorMessage = useMemo(() => {
		if (!error || !("data" in error)) return "";
		const payload = error.data as { message?: string };
		return payload?.message ?? "Не удалось обновить доску";
	}, [error]);

	const initialValues = useMemo<BoardFormInitialValues>(
		() => ({
			title: board.title,
			description: board.description,
			visibility: board.visibility,
			backgroundColor: board.backgroundColor,
			isFavorite: board.isFavorite,
		}),
		[board],
	);

	const onSubmit = useCallback(
		async (values: BoardFormSubmitValues) => {
			try {
				await updateBoard({
					boardId: board.id,
					title: values.title,
					description: values.description?.trim() ? values.description.trim() : null,
					visibility: values.visibility,
					backgroundColor: values.backgroundColor?.trim() ? values.backgroundColor.trim() : null,
				}).unwrap();

				appToast.success("Доска обновлена");
			} catch {
				console.error("Failed to update board", values);
			}
		},
		[board.id, updateBoard],
	);

	useEffect(() => {
		if (error) {
			appToast.error(errorMessage);
		}
	}, [error, errorMessage]);

	return (
		<>
			{isControlled ? (
				<Modal
					title="Редактирование доски"
					isOpen={isOpen}
					onClose={onClose ?? (() => {})}
					onCancel={onClose}
					cancelBtnText="Отмена"
					actionsClassName={cls.actions}
					cancelDisabled={isLoading}
				>
					<BoardForm
						className={classNames(cls.editBoard, {}, [className])}
						renderInPopover={false}
						initialValues={initialValues}
						onSubmit={onSubmit}
						onSuccess={onClose}
						isLoading={isLoading}
						errorMessage={errorMessage}
						submitText="Сохранить"
						showFavorite={false}
					/>
				</Modal>
			) : (
				<BoardForm
					className={classNames(cls.editBoard, {}, [className])}
					trigger={trigger}
					initialValues={initialValues}
					onSubmit={onSubmit}
					isLoading={isLoading}
					errorMessage={errorMessage}
					submitText="Сохранить"
					showFavorite={false}
				/>
			)}
		</>
	);
});
