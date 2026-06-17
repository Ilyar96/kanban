import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback, useState } from "react";
import cls from "./BoardGrid.module.scss";
import { EditBoard, CreateBoard } from "@/features/Board";
import { BoardList } from "@/entities/Board";
import { Grid } from "@/shared/ui/Grid";
import { Text } from "@/shared/ui/Text/Text";
import { useSelector } from "react-redux";
import { getUserId } from "@/entities/User";
import { useGetBoardsByUserIdQuery } from "@/entities/Board";
import { skipToken } from "@reduxjs/toolkit/query";
import type { Board } from "@/shared/types/board";

interface BoardGridProps {
	className?: string;
	title?: string;
	favoritesOnly?: boolean;
}

export const BoardGrid = memo((props: BoardGridProps) => {
	const { className, favoritesOnly, title } = props;
	const [editingBoard, setEditingBoard] = useState<Board | null>(null);
	const userId = useSelector(getUserId);
	const { data, isLoading } = useGetBoardsByUserIdQuery(
		userId
			? {
					userId,
					params: {
						favoritesOnly,
						limit: favoritesOnly ? 12 : undefined,
					},
				}
			: skipToken,
	);

	const onEditBoard = useCallback((board: Board) => {
		setEditingBoard(board);
	}, []);

	const closeEditBoard = useCallback(() => {
		setEditingBoard(null);
	}, []);

	if (data?.boards.length === 0 && favoritesOnly) {
		return null;
	}

	return (
		<Grid
			className={cls.grid}
			gap="16"
			as="section"
		>
			{title && (
				<Text
					size="m"
					title={title}
				/>
			)}
			<Grid
				className={classNames(cls.workspaceGrid, {}, [className])}
				columns={4}
				minColumnWidth="280px"
				gap="16"
			>
				<BoardList
					data={data?.boards ?? []}
					isLoading={isLoading}
					onEditBoard={onEditBoard}
				/>
				{!favoritesOnly && (
					<CreateBoard
						className={cls.createBoard}
						triggerClassName={cls.createBoardTrigger}
					/>
				)}
			</Grid>
			{editingBoard && (
				<EditBoard
					board={editingBoard}
					isOpen={Boolean(editingBoard)}
					onClose={closeEditBoard}
				/>
			)}
		</Grid>
	);
});
