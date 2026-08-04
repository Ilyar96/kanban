import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import { BoardGrid } from "@/widgets/BoardGrid";
import { Container } from "@/shared/ui/Container/Container";
import { Seo } from "@/shared/lib/seo/Seo";
import { VStack } from "@/shared/ui/Stack";
import { Page } from "@/shared/ui/Page/Page";

interface WorkspacePageProps {
	className?: string;
}

const WorkspacePage = memo(({ className }: WorkspacePageProps) => {
	return (
		<Page className={classNames("", {}, [className])}>
			<Seo
				title="Рабочее пространство"
				description="Личное рабочее пространство Kanban с вашими досками и задачами."
				noindex
			/>
			<VStack
				as={Container}
				gap="xxl"
			>
				<BoardGrid
					title="Избранное"
					favoritesOnly
				/>
				<BoardGrid title="Ваши рабочие пространства" />
			</VStack>
		</Page>
	);
});

export default WorkspacePage;
