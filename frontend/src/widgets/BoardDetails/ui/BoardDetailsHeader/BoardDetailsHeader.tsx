import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import { useGetBoardsDetailsQuery } from "../../model/api/boardsDetailsApi";
import { useParams } from "react-router-dom";
import { HStack } from "@/shared/ui/Stack";
import { TextField } from "@/shared/ui/TextField/TextField";
import { useDebouncedCallback } from "use-debounce";
import { useUpdateBoardMutation } from "@/features/Board";
import { getServerErrorIssues } from "@/shared/lib/serverError/serverError";
import { appToast } from "@/shared/lib/toast";
import cls from "./BoardDetailsHeader.module.scss";
import { SpriteIcon } from "../../../../shared/ui/SpriteIcon/SpriteIcon";
import { Button } from "@/shared/ui/Button/Button";
import { Dropdown, type DropdownItem } from "@/shared/ui/Dropdown/Dropdown";
import { MoreActionsButton } from "@/shared/ui/MoreActionsButton/MoreActionsButton";

interface BoardDetailsHeaderProps {
	className?: string;
}

export const BoardDetailsHeader = memo(({ className }: BoardDetailsHeaderProps) => {
	const { boardId } = useParams<{ boardId: string }>();
	const { data } = useGetBoardsDetailsQuery(boardId, { skip: !boardId });
	const [updateBoardTitle, { error }] = useUpdateBoardMutation();
	const [currentTitle, setCurrentTitle] = useState("");
	const serverTitle = data?.board.title ?? "";

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

	const items: DropdownItem[] = useMemo(
		() => [
			{ content: data?.board.isFavorite ? "Удалить из избранного" : "В избранное" },
			{
				content: "Удалить доску",
				className: cls.deleteItem,
				// disabled: isRemoving,
				// onClick: openDeleteModal,
			},
		],
		[],
	);

	return (
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
	);
});
