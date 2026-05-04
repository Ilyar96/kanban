import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import { BoardGrid } from "@/widgets/BoardGrid";
import { Container } from "@/shared/ui/Container/Container";
import { VStack } from "@/shared/ui/Stack";
import { Page } from "@/shared/ui/Page/Page";

interface WorkspacePageProps {
	className?: string;
}

const WorkspacePage = memo(({ className }: WorkspacePageProps) => {
	return (
		<Page>
			<div className={classNames("", {}, [className])}>
				<VStack
					as={Container}
					gap="32"
				>
					<BoardGrid
						title="Избранное"
						favoritesOnly
					/>
					<BoardGrid title="Ваши рабочие пространства" />
				</VStack>
			</div>
		</Page>
	);
});

export default WorkspacePage;
