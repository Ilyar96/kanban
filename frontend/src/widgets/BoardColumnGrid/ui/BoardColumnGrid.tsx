import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import { CreateBoardColumn } from "@/features/CreateBoardColumn";
import { useParams } from "react-router-dom";

interface BoardColumnGridProps {
	className?: string;
}

export const BoardColumnGrid = memo(({ className }: BoardColumnGridProps) => {
	const { boardId } = useParams<{ boardId: string }>();

	if (!boardId) {
		return null;
	}

	return (
		<div className={classNames("", {}, [className])}>
			<CreateBoardColumn boardId={boardId} />
		</div>
	);
});
