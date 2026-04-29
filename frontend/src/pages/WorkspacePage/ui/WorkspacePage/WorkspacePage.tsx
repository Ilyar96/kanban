import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./WorkspacePage.module.scss";
import { WorkspaceGrid } from "@/widgets/WorkspaceGrid";
import { Container } from "@/shared/ui/Container/Container";

interface WorkspacePageProps {
	className?: string;
}

const WorkspacePage = memo(({ className }: WorkspacePageProps) => {
	return (
		<section className={classNames(cls.workspacePage, {}, [className])}>
			<Container>
				<WorkspaceGrid />
			</Container>
		</section>
	);
});

export default WorkspacePage;
