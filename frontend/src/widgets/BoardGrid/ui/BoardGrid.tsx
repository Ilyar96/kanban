import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./BoardGrid.module.scss";
import { CreateBoard } from "@/features/CreateBoard";
import { BoardList } from "@/entities/Board";
import { Grid } from "@/shared/ui/Grid";
import { Text } from "@/shared/ui/Text/Text";
// TODO все workspace на boards заменить!!!
interface BoardGridProps {
	className?: string;
	title?: string;
	favoritesOnly?: boolean;
}

export const BoardGrid = memo((props: BoardGridProps) => {
	const { className, favoritesOnly, title } = props;
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
				<BoardList favoritesOnly={favoritesOnly} />
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
