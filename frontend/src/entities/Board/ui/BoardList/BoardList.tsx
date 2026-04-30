import { memo } from "react";
import { useSelector } from "react-redux";
import { useGetBoardsByUserIdQuery } from "../../model/api/boardsApi";
import { getUserId } from "@/entities/User";
import { skipToken } from "@reduxjs/toolkit/query";
import { BoardCard } from "../BoardCard/BoardCard";
import { BoardCardSkeleton } from "../BoardCardSkeleton/BoardCardSkeleton";

interface BoardListProps {
	favoritesOnly?: boolean;
}

export const BoardList = memo((props: BoardListProps) => {
	const { favoritesOnly } = props;
	const userId = useSelector(getUserId);
	const { data, isLoading } = useGetBoardsByUserIdQuery(
		userId
			? {
					userId,
					params: {
						favoritesOnly,
						limit: 4,
					},
				}
			: skipToken,
	);

	const Skeletons = Array.from({ length: 3 }, (_, index) => <BoardCardSkeleton key={index} />);

	if (isLoading) {
		return <>{Skeletons}</>;
	}

	return (
		<>
			{data?.boards?.map(({ id, backgroundColor, title, isFavorite }) => (
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
