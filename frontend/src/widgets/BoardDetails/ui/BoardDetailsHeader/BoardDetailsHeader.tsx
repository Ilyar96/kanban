import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import { useGetBoardsDetailsQuery } from "../../model/api/boardsDetailsApi";
import { useNavigate, useParams } from "react-router-dom";
import { HStack } from "@/shared/ui/Stack";
import { TextField } from "@/shared/ui/TextField/TextField";
import { useDebouncedCallback } from "use-debounce";
import {
	useCreateBoardInvitationMutation,
	useDeleteBoardInvitationMutation,
	useGetBoardInvitationsQuery,
	useUpdateBoardMutation,
	type BoardInvitationRole,
} from "@/features/Board";
import {
	useAddBoardToFavoriteMutation,
	useDeleteBoardMutation,
	useRemoveBoardFromFavoriteMutation,
} from "@/entities/Board";
import { getServerErrorIssues } from "@/shared/lib/serverError/serverError";
import { getServerErrorMessage } from "@/shared/lib/serverError/serverError";
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
	isOwner?: boolean;
}

export const BoardDetailsHeader = memo(
	({ className, isOwner = false }: BoardDetailsHeaderProps) => {
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
		const [createInvitation, { isLoading: isSharing }] = useCreateBoardInvitationMutation();
		const [deleteInvitation, { isLoading: isDeletingInvitation }] =
			useDeleteBoardInvitationMutation();
		const [currentTitle, setCurrentTitle] = useState("");
		const [isShareModalOpen, setShareModalOpen] = useState(false);
		const [inviteEmail, setInviteEmail] = useState("");
		const [inviteRole, setInviteRole] = useState<BoardInvitationRole>("EDITOR");
		const inviteRoleLabels: Record<BoardInvitationRole, string> = {
			EDITOR: "Редактор",
			MOVER: "Наблюдатель",
		};
		const [manualInviteLink, setManualInviteLink] = useState<string | null>(null);
		const [invitationToDelete, setInvitationToDelete] = useState<{
			id: string;
			email: string;
		} | null>(null);
		const serverTitle = data?.board.title ?? "";
		const isFavorite = data?.board.isFavorite ?? false;
		const { data: invitationsData, isFetching: isInvitationsLoading } = useGetBoardInvitationsQuery(
			boardId!,
			{
				skip: !boardId || !isOwner || !isShareModalOpen,
			},
		);

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
			if (!isOwner || !boardId || isAdding || isRemoving) {
				return;
			}

			if (isFavorite) {
				removeBoardFromFavorite(boardId);
			} else {
				addBoardToFavorite(boardId);
			}
		}, [
			addBoardToFavorite,
			boardId,
			isAdding,
			isFavorite,
			isOwner,
			isRemoving,
			removeBoardFromFavorite,
		]);

		const openDeleteModal = useCallback(() => {
			if (!isOwner) {
				return;
			}

			setDeleteModalOpen(true);
		}, [isOwner]);

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

		const openShareModal = useCallback(() => {
			if (!isOwner) {
				return;
			}

			setManualInviteLink(null);
			setShareModalOpen(true);
		}, [isOwner]);

		const closeShareModal = useCallback(() => {
			if (isSharing || isDeletingInvitation) {
				return;
			}

			setShareModalOpen(false);
			setManualInviteLink(null);
		}, [isDeletingInvitation, isSharing]);

		const onConfirmShare = useCallback(async () => {
			if (!isOwner || !boardId || isSharing) {
				return;
			}

			const normalizedEmail = inviteEmail.trim().toLowerCase();

			if (!normalizedEmail) {
				appToast.error("Введите email");
				return;
			}

			try {
				const response = await createInvitation({
					boardId,
					email: normalizedEmail,
					role: inviteRole,
				}).unwrap();

				const inviteLink = `${window.location.origin}${RoutePaths.board}/${boardId}?invite=${response.invitation.token}`;
				let isCopied = false;

				try {
					await navigator.clipboard.writeText(inviteLink);
					isCopied = true;
				} catch {
					setManualInviteLink(inviteLink);
				}

				if (isCopied) {
					setShareModalOpen(false);
					setManualInviteLink(null);
					setInviteEmail("");
					setInviteRole("EDITOR");
					appToast.success("Приглашение создано. Ссылка скопирована в буфер.");
					return;
				}

				appToast.success("Приглашение создано. Скопируйте ссылку вручную из модалки.");
			} catch (error) {
				appToast.error(getServerErrorMessage(error) ?? "Не удалось создать приглашение");
			}
		}, [boardId, createInvitation, inviteEmail, inviteRole, isOwner, isSharing]);

		const openInvitationDeleteModal = useCallback((invitationId: string, email: string) => {
			setInvitationToDelete({ id: invitationId, email });
		}, []);

		const closeInvitationDeleteModal = useCallback(() => {
			if (isDeletingInvitation) {
				return;
			}

			setInvitationToDelete(null);
		}, [isDeletingInvitation]);

		const onConfirmDeleteInvitation = useCallback(async () => {
			if (!boardId || !invitationToDelete || isDeletingInvitation) {
				return;
			}

			try {
				await deleteInvitation({
					boardId,
					invitationId: invitationToDelete.id,
				}).unwrap();

				setInvitationToDelete(null);
				appToast.success("Приглашение удалено");
			} catch (error) {
				appToast.error(getServerErrorMessage(error) ?? "Не удалось удалить приглашение");
			}
		}, [boardId, deleteInvitation, invitationToDelete, isDeletingInvitation]);

		const onCopyInvitationLink = useCallback(
			async (token: string) => {
				if (!boardId) {
					return;
				}

				const inviteLink = `${window.location.origin}${RoutePaths.board}/${boardId}?invite=${token}`;

				try {
					await navigator.clipboard.writeText(inviteLink);
					appToast.success("Ссылка-приглашение скопирована");
				} catch {
					appToast.error("Не удалось скопировать ссылку");
				}
			},
			[boardId],
		);

		const items: DropdownItem[] = useMemo(
			() =>
				isOwner
					? [
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
						]
					: [],
			[isAdding, isDeleting, isFavorite, isOwner, isRemoving, onToggleFavorite, openDeleteModal],
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
						gap="s"
					>
						{isOwner && (
							<>
								<Button onClick={openShareModal}>
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
							</>
						)}
					</HStack>
				</HStack>
				{isOwner && (
					<Modal
						title="Поделиться доской"
						isOpen={isShareModalOpen}
						onClose={closeShareModal}
						onCancel={closeShareModal}
						onConfirm={onConfirmShare}
						confirmBtnText={isSharing ? "Отправляем..." : "Отправить приглашение"}
						cancelBtnText="Отмена"
						confirmDisabled={isSharing}
						cancelDisabled={isSharing}
					>
						<div className={cls.shareModalBody}>
							<TextField
								label="Email"
								value={inviteEmail}
								onChange={setInviteEmail}
								placeholder="user@example.com"
								type="email"
							/>
							<div className={cls.shareRoleField}>
								<span className={cls.shareRoleLabel}>Роль</span>
								<select
									className={cls.shareRoleSelect}
									value={inviteRole}
									onChange={(event) => setInviteRole(event.target.value as BoardInvitationRole)}
								>
									<option value="EDITOR">Редактор</option>
									<option value="MOVER">Наблюдатель</option>
								</select>
							</div>
							<Text
								className={cls.shareHint}
								size="s"
								text="После создания приглашения ссылка будет скопирована в буфер обмена."
							/>
							{manualInviteLink && (
								<div className={cls.manualLinkBlock}>
									<Text
										size="s"
										text="Не удалось скопировать автоматически. Скопируйте ссылку вручную:"
									/>
									<TextField
										value={manualInviteLink}
										readonly
										fieldSize="s"
									/>
								</div>
							)}
							<div className={cls.invitedList}>
								<Text
									className={cls.invitedListTitle}
									size="s"
									text="Приглашенные"
								/>
								{isInvitationsLoading && (
									<Text
										size="s"
										text="Загружаем список приглашений..."
									/>
								)}
								{!isInvitationsLoading && (invitationsData?.invitations.length ?? 0) === 0 && (
									<Text
										className={cls.invitedEmpty}
										size="s"
										text="Пока нет активных приглашений"
										theme="secondary"
									/>
								)}
								{(invitationsData?.invitations ?? []).map((invitation) => (
									<div
										className={cls.invitedItem}
										key={invitation.id}
									>
										<div className={cls.invitedMeta}>
											<span className={cls.invitedEmail}>{invitation.email}</span>
											<span className={cls.invitedRole}>
												{inviteRoleLabels[invitation.role]} • {invitation.status}
											</span>
										</div>
										<div className={cls.invitationActions}>
											<Button
												size="s"
												theme="outline"
												onClick={() => onCopyInvitationLink(invitation.token)}
												disabled={isDeletingInvitation}
											>
												<SpriteIcon spriteId="icon-copy" />
												<span className="visually-hidden">Скопировать</span>
											</Button>
											<Button
												className={cls.invitationDeleteBtn}
												theme="outline_red"
												size="s"
												onClick={() => openInvitationDeleteModal(invitation.id, invitation.email)}
												disabled={isDeletingInvitation}
											>
												Удалить
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					</Modal>
				)}
				{isOwner && (
					<Modal
						title="Удалить приглашение?"
						isOpen={Boolean(invitationToDelete)}
						onClose={closeInvitationDeleteModal}
						onCancel={closeInvitationDeleteModal}
						onConfirm={onConfirmDeleteInvitation}
						confirmBtnText={isDeletingInvitation ? "Удаляем..." : "Удалить"}
						cancelBtnText="Отмена"
						confirmDisabled={isDeletingInvitation}
						cancelDisabled={isDeletingInvitation}
					>
						<Text
							size="s"
							text={`Приглашение для ${invitationToDelete?.email ?? "пользователя"} будет удалено.`}
						/>
					</Modal>
				)}
				{isOwner && (
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
				)}
			</>
		);
	},
);
