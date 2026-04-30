import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./BoardGrid.module.scss";
import { CreateBoard } from "@/features/CreateBoard";
import { BoardList } from "@/entities/Board";
import { Grid } from "@/shared/ui/Grid";
import { Text } from "@/shared/ui/Text/Text";
import { useSelector } from "react-redux";
import { getUserId } from "@/entities/User";
import { useGetBoardsByUserIdQuery } from "@/entities/Board";
import { skipToken } from "@reduxjs/toolkit/query";

// TODO все workspace на boards заменить!!!
interface BoardGridProps {
	className?: string;
	title?: string;
	favoritesOnly?: boolean;
}

export const BoardGrid = memo((props: BoardGridProps) => {
	const { className, favoritesOnly, title } = props;
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

	if (data?.boards.length === 0) {
		return null;
	}

	return (
		<Grid
			className={cls.grid}
			gap="16"
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
				/>
				{!favoritesOnly && (
					<CreateBoard
						className={cls.createWorkspace}
						triggerClassName={cls.createWorkspaceTrigger}
					/>
				)}
			</Grid>
		</Grid>
	);
});
