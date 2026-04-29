import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./WorkspaceGrid.module.scss";
import { CreateWorkspace } from "@/features/CreateWorkspace";

interface WorkspaceGridProps {
	className?: string;
}

export const WorkspaceGrid = memo(({ className }: WorkspaceGridProps) => {
	return (
		<div className={classNames(cls.workspaceGrid, {}, [className])}>
			<CreateWorkspace />
		</div>
	);
});
