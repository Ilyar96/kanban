import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./WorkspaceGrid.module.scss";
import { CreateBoard } from "@/features/CreateBoard";
import { BoardList } from "@/entities/Board";
import { Grid } from "@/shared/ui/Grid";
import { Text } from "@/shared/ui/Text/Text";

interface WorkspaceGridProps {
	className?: string;
}

export const WorkspaceGrid = memo(({ className }: WorkspaceGridProps) => {
	return (
		<Grid gap="16">
			<Text
				size="l"
				title="Ваши рабочие пространства"
			/>
			<Grid
				className={classNames(cls.workspaceGrid, {}, [className])}
				columns={4}
				minColumnWidth="280px"
				gap="16"
			>
				<BoardList />
				<CreateBoard
					className={cls.createWorkspace}
					triggerClassName={cls.createWorkspaceTrigger}
				/>
			</Grid>
		</Grid>
	);
});
