import { memo } from "react";
import { useSelector } from "react-redux";
import { useGetBoardsByUserIdQuery } from "../../model/api/getBoardsByUserIdApi";
import { getUserId } from "@/entities/User";
import { skipToken } from "@reduxjs/toolkit/query";
import { BoardCard } from "../BoardCard/BoardCard";
import { BoardCardSkeleton } from "../BoardCardSkeleton/BoardCardSkeleton";

export const BoardList = memo(() => {
	const userId = useSelector(getUserId);
	const { data, error, isLoading } = useGetBoardsByUserIdQuery(userId ?? skipToken);
	console.log("data: ", data);
	console.log("error, isLoading: ", error, isLoading);

	const Skeletons = Array.from({ length: 3 }, (_, index) => <BoardCardSkeleton key={index} />);

	if (isLoading) {
		return <>{Skeletons}</>;
	}

	return (
		<>
			{data?.boards?.map(({ id, backgroundColor, title }) => (
				<BoardCard
					key={id}
					background={backgroundColor}
					title={title}
					// TODO to - add real link
					// to="/"
				/>
			))}
		</>
	);
});
