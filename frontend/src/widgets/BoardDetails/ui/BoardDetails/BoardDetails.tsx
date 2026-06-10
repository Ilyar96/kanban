import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import { useGetBoardsDetailsQuery } from "../../model/api/boardsDetailsApi";
import { HStack, VStack } from "@/shared/ui/Stack";
import { useParams } from "react-router-dom";
import { ColumnList } from "../ColumnList/ColumnList";
import type { Task } from "@/shared/types/board";
import { BoardDetailsHeader } from "../BoardDetailsHeader/BoardDetailsHeader";
import { Skeleton } from "@/shared/ui/Skeleton/Skeleton";
import { PageError } from "@/shared/ui/PageError";
import { getIsUserAuth } from "@/entities/User";
import { useSelector } from "react-redux";
import { RequireAuth } from "../RequireAuth/RequireAuth";
import cls from "./BoardDetails.module.scss";

interface BoardDetailsProps {
	className?: string;
	onTaskClick?: (task: Task) => void;
}

export const BoardDetails = memo((props: BoardDetailsProps) => {
	const { className, onTaskClick } = props;
	const { boardId } = useParams<{ boardId: string }>();
	const { data, isLoading, error } = useGetBoardsDetailsQuery(boardId);
	const isAuth = useSelector(getIsUserAuth);

	const canEdit = true; // TODO: permissions

	if (!isAuth) {
		return <RequireAuth />;
	}

	if (!boardId) {
		return null;
	}

	if (error) {
		return <PageError title="Что-то пошло не так. Попробуй обновить страницу." />;
	}

	if (isLoading || !data) {
		return (
			<div className={classNames(cls.boardLoading, {}, [className])}>
				<Skeleton
					className={cls.wrapper}
					width="100%"
					height="100%"
				/>
			</div>
		);
	}

	return (
		<VStack
			className={cls.wrapper}
			gap="16"
			style={{ background: data.board.backgroundColor }}
		>
			<BoardDetailsHeader />
			<HStack
				gap="16"
				className={classNames(cls.boardDetails, {}, [className])}
			>
				<ColumnList
					boardId={boardId}
					columns={data.board.columns ?? []}
					canEdit={canEdit}
					onTaskClick={onTaskClick}
				/>
			</HStack>
		</VStack>
	);
});
