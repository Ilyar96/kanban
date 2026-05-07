import { memo, useCallback, useState } from "react";
import { TextField } from "@/shared/ui/TextField/TextField";
import { useUpdateBoardColumnMutation } from "../../model/api/updateBoardColumnApi";
import { useDebouncedCallback } from "use-debounce";

interface BoardColumnTitleProps {
	title: string;
	boardId: string;
	columnId: string;
	className?: string;
}

export const BoardColumnTitle = memo((props: BoardColumnTitleProps) => {
	const { className, title, boardId, columnId } = props;
	const [currentTitle, setCurrentTitle] = useState(title);

	const [updateBoardColumn] = useUpdateBoardColumnMutation();

	const debouncedTitleUpdate = useDebouncedCallback((value: string) => {
		updateBoardColumn({ boardId, columnId, title: value });
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
			className={className}
			size="s"
			value={currentTitle}
			theme="clear"
			onChange={onChange}
		/>
	);
});
