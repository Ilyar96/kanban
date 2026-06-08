import { memo, useCallback, useEffect, useState } from "react";
import { TextField } from "@/shared/ui/TextField/TextField";
import { useUpdateBoardColumnMutation } from "../../model/api/updateBoardColumnApi";
import { useDebouncedCallback } from "use-debounce";
import { classNames } from "@/shared/lib/classNames/classNames";
import { getServerErrorIssues } from "@/shared/lib/serverError/serverError";
import { appToast } from "@/shared/lib/toast";

interface BoardColumnTitleProps {
	title: string;
	boardId: string;
	columnId: string;
	className?: string;
}

export const BoardColumnTitle = memo((props: BoardColumnTitleProps) => {
	const { className, title, boardId, columnId } = props;
	const [currentTitle, setCurrentTitle] = useState(title);

	const [updateBoardColumn, { error }] = useUpdateBoardColumnMutation();
	const titleError = getServerErrorIssues(error)?.title;

	useEffect(() => {
		setCurrentTitle(title);
	}, [title]);

	const debouncedTitleUpdate = useDebouncedCallback(async (nextTitle: string) => {
		const normalizedTitle = nextTitle.trim();

		if (normalizedTitle === title.trim()) {
			return;
		}

		try {
			await updateBoardColumn({ boardId, columnId, title: normalizedTitle }).unwrap();
		} catch {
			appToast.error("Не удалось переименовать колонку");
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
		<TextField
			className={classNames("", {}, [className])}
			size="m"
			value={currentTitle}
			theme="clear"
			onChange={onChange}
			error={titleError}
			placeholder="Введите название колонки"
		/>
	);
});
