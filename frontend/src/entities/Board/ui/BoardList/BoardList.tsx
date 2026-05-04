import { memo } from "react";
import { BoardCard } from "../BoardCard/BoardCard";
import { BoardCardSkeleton } from "../BoardCardSkeleton/BoardCardSkeleton";
import type { Board } from "@/shared/types/board";

interface BoardListProps {
	data?: Board[];
	isLoading?: boolean;
	onEditBoard?: (board: Board) => void;
}

export const BoardList = memo((props: BoardListProps) => {
	const { data, isLoading, onEditBoard } = props;

	const Skeletons = Array.from({ length: 3 }, (_, index) => <BoardCardSkeleton key={index} />);

	if (isLoading) {
		return <>{Skeletons}</>;
	}

	return (
		<>
			{data?.map((board) => (
				<BoardCard
					key={board.id}
					background={board.backgroundColor}
					title={board.title}
					id={board.id}
					isFavorite={board.isFavorite ?? false}
					onEditClick={onEditBoard ? () => onEditBoard(board) : undefined}
					// TODO to - add real link
					// to="/"
				/>
			))}
		</>
	);
});
