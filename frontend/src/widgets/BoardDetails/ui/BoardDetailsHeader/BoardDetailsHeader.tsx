import { memo, useCallback, useEffect, useState } from "react";
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

	return (
		<HStack className={classNames(cls.boardDetailsHeader, {}, [className])}>
			<TextField
				className={cls.titleField}
				value={currentTitle}
				onChange={onChange}
				error={titleError}
				placeholder="Введите название доски"
				theme="clear"
			/>
		</HStack>
	);
});
