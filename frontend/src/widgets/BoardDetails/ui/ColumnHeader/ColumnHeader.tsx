import { memo, useCallback, useMemo, useState } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import type { BoardColumn } from "@/shared/types/board";
import { HStack } from "@/shared/ui/Stack";
import {
	BoardColumnTitle,
	useDeleteBoardColumnMutation,
	useMoveBoardColumnMutation,
} from "@/features/BoardColumn";
import { Dropdown, type DropdownItem } from "@/shared/ui/Dropdown/Dropdown";
import { MoreActionsButton } from "@/shared/ui/MoreActionsButton/MoreActionsButton";
import cls from "./ColumnHeader.module.scss";
import { Modal } from "@/shared/ui/Modal/Modal";
import { Text } from "@/shared/ui/Text/Text";
import { appToast } from "@/shared/lib/toast";
import { ListBox } from "@/shared/ui/ListBox/ListBox";
import { useGetBoardsDetailsQuery } from "../../model/api/boardsDetailsApi";

interface ColumnHeaderProps {
	className?: string;
	column: BoardColumn;
	boardId: string;
}

export const ColumnHeader = memo((props: ColumnHeaderProps) => {
	const { className, column, boardId } = props;
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isMoveModalOpen, setMoveModalOpen] = useState(false);
	const [position, setPosition] = useState(column.position.toString());
	const { data: boardDetails } = useGetBoardsDetailsQuery(boardId);
	const [moveBoardColumn, { isLoading: isMoveBoardColumnMoving }] = useMoveBoardColumnMutation();
	const [deleteBoardColumn, { isLoading: isDeleteBoardColumnDeleting }] =
		useDeleteBoardColumnMutation();

	const openDeleteModal = useCallback(() => {
		setDeleteModalOpen(true);
	}, []);

	const closeDeleteModal = useCallback(() => {
		if (isDeleteBoardColumnDeleting) return;
		setDeleteModalOpen(false);
	}, [isDeleteBoardColumnDeleting]);

	const openMoveModal = useCallback(() => {
		setMoveModalOpen(true);
	}, []);

	const closeMoveModal = useCallback(() => {
		setMoveModalOpen(false);
	}, []);

	const onConfirmDelete = useCallback(async () => {
		if (isDeleteBoardColumnDeleting) return;

		try {
			await deleteBoardColumn({ boardId, columnId: column.id }).unwrap();
			setDeleteModalOpen(false);
			appToast.success("Колонка удалена");
		} catch {
			appToast.error("Не удалось удалить колонку");
		}
	}, [column.id, deleteBoardColumn, isDeleteBoardColumnDeleting, boardId]);

	const onConfirmMove = useCallback(async () => {
		if (isMoveBoardColumnMoving) return;

		try {
			await moveBoardColumn({
				boardId,
				columnId: column.id,
				targetPosition: Number(position),
			}).unwrap();
			setMoveModalOpen(false);
			appToast.success("Колонка успешно перемещена");
		} catch {
			appToast.error("Не удалось переместить колонку");
		}
	}, [column.id, moveBoardColumn, isMoveBoardColumnMoving, boardId, position]);

	const actions: DropdownItem[] = useMemo(
		() => [
			{
				content: "Переместить",
				onClick: openMoveModal,
			},
			{
				content: "Удалить",
				onClick: openDeleteModal,
				className: cls.delete,
			},
		],
		[openDeleteModal, openMoveModal],
	);

	const positions = boardDetails?.board.columns?.map((col) => {
		return {
			content: col.position.toString(),
			value: col.position.toString(),
			className: classNames(cls.positionItem, {
				[cls.positionItemCurrent]: col.position.toString() === position,
			}),
			disabled: col.id === column.id,
		};
	});

	return (
		<>
			<HStack
				className={classNames("", {}, [className])}
				gap="8"
				justify="between"
				max
			>
				<BoardColumnTitle
					title={column.title}
					boardId={boardId}
					columnId={column.id}
				/>
				<Dropdown
					items={actions}
					trigger={<MoreActionsButton type="horizontal" />}
					anchorTo="right start"
				/>
			</HStack>
			<Modal
				title="Вы действительно хотите удалить эту колонку?"
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onCancel={closeDeleteModal}
				onConfirm={onConfirmDelete}
				confirmBtnText={isDeleteBoardColumnDeleting ? "Удаляем..." : "Удалить"}
				cancelBtnText="Отмена"
				confirmDisabled={isDeleteBoardColumnDeleting}
				cancelDisabled={isDeleteBoardColumnDeleting}
			>
				<Text
					theme="error"
					text="Это действие нельзя отменить."
				/>
			</Modal>
			<Modal
				title="Переместить?"
				isOpen={isMoveModalOpen}
				onClose={closeMoveModal}
				onCancel={closeMoveModal}
				onConfirm={onConfirmMove}
				confirmBtnText="Переместить"
				cancelBtnText="Отмена"
				confirmDisabled={position === column.position.toString()}
				cancelDisabled={isMoveBoardColumnMoving}
			>
				<ListBox
					items={positions}
					value={position}
					onChange={setPosition}
					label="Позиция"
				/>
			</Modal>
		</>
	);
});
