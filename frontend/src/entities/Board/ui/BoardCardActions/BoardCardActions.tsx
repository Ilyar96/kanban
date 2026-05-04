import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import cls from "./BoardCardActions.module.scss";
import { HStack } from "@/shared/ui/Stack";
import { Button } from "@/shared/ui/Button/Button";
import { Dropdown, type DropdownItem } from "@/shared/ui/Dropdown/Dropdown";
import { FavoriteButton } from "../FavoriteButton/FavoriteButton";
import { SpriteIcon } from "@/shared/ui/SpriteIcon/SpriteIcon";
import {
	useAddBoardToFavoriteMutation,
	useDeleteBoardMutation,
	useRemoveBoardFromFavoriteMutation,
} from "../../model/api/boardsApi";
import { appToast } from "@/shared/lib/toast";
import { Modal } from "@/shared/ui/Modal/Modal";
import { Text } from "@/shared/ui/Text/Text";

interface BoardCardActionsProps {
	className?: string;
	boardId: string;
	isFavorite: boolean;
}

export const BoardCardActions = memo((props: BoardCardActionsProps) => {
	const { className, boardId, isFavorite } = props;
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [addBoardToFavorite, { isLoading: isAdding, error: addError }] =
		useAddBoardToFavoriteMutation();
	const [removeBoardFromFavorite, { isLoading: isRemoving, error: removeError }] =
		useRemoveBoardFromFavoriteMutation();
	const [deleteBoard, { isLoading: isDeleting }] = useDeleteBoardMutation();

	const trigger = (
		<Button className={cls.settingsBtn}>
			<SpriteIcon
				className={cls.boardSettingsIcon}
				spriteId="three-dots-vertical"
			/>
			<span className="visually-hidden">Настройки доски</span>
		</Button>
	);

	const onToggleFavorite = useCallback(() => {
		if (isFavorite) {
			removeBoardFromFavorite(boardId);
		} else {
			addBoardToFavorite(boardId);
		}
	}, [addBoardToFavorite, removeBoardFromFavorite, boardId, isFavorite]);

	const openDeleteModal = useCallback(() => {
		setDeleteModalOpen(true);
	}, []);

	const closeDeleteModal = useCallback(() => {
		if (isDeleting) return;
		setDeleteModalOpen(false);
	}, [isDeleting]);

	const onConfirmDelete = useCallback(async () => {
		if (isDeleting) return;

		try {
			await deleteBoard(boardId).unwrap();
			setDeleteModalOpen(false);
			appToast.success("Доска удалена");
		} catch {
			appToast.error("Не удалось удалить доску");
		}
	}, [boardId, deleteBoard, isDeleting]);

	const items: DropdownItem[] = useMemo(
		() => [
			{ content: "Редактировать" },
			{
				content: "Удалить",
				className: cls.deleteItem,
				disabled: isRemoving,
				onClick: openDeleteModal,
			},
		],
		[isRemoving, openDeleteModal],
	);

	useEffect(() => {
		if (addError) {
			appToast.error("Не удалось добавить доску в избранное");
		}
		if (removeError) {
			appToast.error("Не удалось удалить доску из избранного");
		}
	}, [addError, removeError]);

	return (
		<>
			<HStack
				className={classNames(cls.boardCardActions, {}, [className])}
				align="center"
				justify="between"
			>
				<FavoriteButton
					className={cls.favorite}
					onToggle={onToggleFavorite}
					isFavorite={isFavorite}
					disabled={isAdding || isRemoving}
				/>

				<Dropdown
					className={cls.settings}
					trigger={trigger}
					items={items}
					anchorTo="bottom end"
				/>
			</HStack>
			<Modal
				title="Вы действительно хотите удалить эту доску?"
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
