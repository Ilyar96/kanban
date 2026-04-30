import { memo } from "react";
import { BoardCard } from "../BoardCard/BoardCard";
import { BoardCardSkeleton } from "../BoardCardSkeleton/BoardCardSkeleton";
import type { Board } from "@/shared/types/board";

interface BoardListProps {
	data?: Board[];
	isLoading?: boolean;
}

export const BoardList = memo((props: BoardListProps) => {
	const { data, isLoading } = props;

	const Skeletons = Array.from({ length: 3 }, (_, index) => <BoardCardSkeleton key={index} />);

	if (isLoading) {
		return <>{Skeletons}</>;
	}

	return (
		<>
			{data?.map(({ id, backgroundColor, title, isFavorite }) => (
				<BoardCard
					key={id}
					background={backgroundColor}
					title={title}
					id={id}
					isFavorite={isFavorite ?? false}
					// TODO to - add real link
					// to="/"
				/>
			))}
		</>
	);
});
