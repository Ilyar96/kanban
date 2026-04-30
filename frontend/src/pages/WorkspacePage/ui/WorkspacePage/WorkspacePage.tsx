import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import { BoardGrid } from "@/widgets/BoardGrid";
import { Container } from "@/shared/ui/Container/Container";
import { VStack } from "@/shared/ui/Stack";

interface WorkspacePageProps {
	className?: string;
}

const WorkspacePage = memo(({ className }: WorkspacePageProps) => {
	return (
		<section className={classNames("", {}, [className])}>
			<VStack
				as={Container}
				gap="32"
			>
				<BoardGrid title="Избранное" favoritesOnly />
				<BoardGrid title="Ваши рабочие пространства" />
			</VStack>
		</section>
	);
});

export default WorkspacePage;
