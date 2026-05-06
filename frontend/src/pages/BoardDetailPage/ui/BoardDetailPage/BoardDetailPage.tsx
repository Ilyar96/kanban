import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import { useParams } from "react-router-dom";
import { Page } from "@/shared/ui/Page/Page";
import { Container } from "@/shared/ui/Container/Container";
import { BoardDetails } from "@/widgets/BoardDetails";

interface BoardDetailPageProps {
	className?: string;
}

const BoardDetailPage = memo(({ className }: BoardDetailPageProps) => {
	const { boardId } = useParams<{ boardId: string }>();
	console.log("boardId: ", boardId);
	return (
		<Page className={classNames("", {}, [className])}>
			<Container>
				<h1>Моя доска</h1>
				<BoardDetails />
			</Container>
		</Page>
	);
});

export default BoardDetailPage;
