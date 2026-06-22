import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import { useGetBoardsDetailsQuery } from "../../model/api/boardsDetailsApi";
import { useNavigate, useParams } from "react-router-dom";
import { HStack } from "@/shared/ui/Stack";
import { TextField } from "@/shared/ui/TextField/TextField";
import { useDebouncedCallback } from "use-debounce";
import { useUpdateBoardMutation } from "@/features/Board";
import {
	useAddBoardToFavoriteMutation,
	useDeleteBoardMutation,
	useRemoveBoardFromFavoriteMutation,
} from "@/entities/Board";
import { getServerErrorIssues } from "@/shared/lib/serverError/serverError";
import { appToast } from "@/shared/lib/toast";
import cls from "./BoardDetailsHeader.module.scss";
import { SpriteIcon } from "../../../../shared/ui/SpriteIcon/SpriteIcon";
import { Button } from "@/shared/ui/Button/Button";
import { Dropdown, type DropdownItem } from "@/shared/ui/Dropdown/Dropdown";
import { MoreActionsButton } from "@/shared/ui/MoreActionsButton/MoreActionsButton";
import { Modal } from "@/shared/ui/Modal/Modal";
import { Text } from "@/shared/ui/Text/Text";
import { RoutePaths } from "@/shared/const/router";

interface BoardDetailsHeaderProps {
	className?: string;
}

export const BoardDetailsHeader = memo(({ className }: BoardDetailsHeaderProps) => {
	const { boardId } = useParams<{ boardId: string }>();
	const navigate = useNavigate();
	const { data } = useGetBoardsDetailsQuery(boardId, { skip: !boardId });
	const [updateBoardTitle, { error }] = useUpdateBoardMutation();
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [addBoardToFavorite, { isLoading: isAdding, error: addError }] =
		useAddBoardToFavoriteMutation();
	const [removeBoardFromFavorite, { isLoading: isRemoving, error: removeError }] =
		useRemoveBoardFromFavoriteMutation();
	const [deleteBoard, { isLoading: isDeleting }] = useDeleteBoardMutation();
	const [currentTitle, setCurrentTitle] = useState("");
	const serverTitle = data?.board.title ?? "";
	const isFavorite = data?.board.isFavorite ?? false;

	const titleError = getServerErrorIssues(error)?.title;

	useEffect(() => {
		setCurrentTitle(serverTitle);
	}, [serverTitle]);

	const debouncedTitleUpdate = useDebouncedCallback(async (nextTitle: string) => {
		if (!boardId) {
			return;
		}

		const normalizedTitle = nextTitle.trim();

		if (normalizedTitle === serverTitle.trim()) {
			return;
		}

		try {
			await updateBoardTitle({ boardId, title: normalizedTitle }).unwrap();
		} catch {
			appToast.error("Не удалось переименовать доску");
		}
	}, 500);

	const onChange = useCallback(
		(value: string) => {
			setCurrentTitle(value);
			debouncedTitleUpdate(value);
		},
		[debouncedTitleUpdate],
	);

	const onToggleFavorite = useCallback(() => {
		if (!boardId || isAdding || isRemoving) {
			return;
		}

		if (isFavorite) {
			removeBoardFromFavorite(boardId);
		} else {
			addBoardToFavorite(boardId);
		}
	}, [addBoardToFavorite, boardId, isAdding, isFavorite, isRemoving, removeBoardFromFavorite]);

	const openDeleteModal = useCallback(() => {
		setDeleteModalOpen(true);
	}, []);

	const closeDeleteModal = useCallback(() => {
		if (isDeleting) {
			return;
		}

		setDeleteModalOpen(false);
	}, [isDeleting]);

	const onConfirmDelete = useCallback(async () => {
		if (!boardId || isDeleting) {
			return;
		}

		try {
			await deleteBoard(boardId).unwrap();
			setDeleteModalOpen(false);
			appToast.success("Доска удалена");
			navigate(RoutePaths.main);
		} catch {
			appToast.error("Не удалось удалить доску");
		}
	}, [boardId, deleteBoard, isDeleting, navigate]);

	const items: DropdownItem[] = useMemo(
		() => [
			{
				content: isFavorite ? "Удалить из избранного" : "В избранное",
				disabled: isAdding || isRemoving,
				onClick: onToggleFavorite,
			},
			{
				content: "Удалить доску",
				className: cls.deleteItem,
				disabled: isDeleting,
				onClick: openDeleteModal,
			},
		],
		[isAdding, isDeleting, isFavorite, isRemoving, onToggleFavorite, openDeleteModal],
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
				className={classNames(cls.boardDetailsHeader, {}, [className])}
				align="center"
				justify="between"
			>
				<TextField
					className={cls.titleField}
					value={currentTitle}
					onChange={onChange}
					error={titleError}
					placeholder="Введите название доски"
					theme="clear"
				/>

				<HStack
					align="center"
					gap="8"
				>
					<Button>
						<SpriteIcon spriteId="icon-share" />
						<span>Поделиться</span>
					</Button>

					<Dropdown
						className={cls.options}
						trigger={
							<MoreActionsButton
								className={cls.optionsTrigger}
								type="horizontal"
							/>
						}
						items={items}
						anchorTo="bottom end"
					/>
				</HStack>
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
