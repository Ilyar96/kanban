import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./BoardDetailPage.module.scss";
import { useParams } from "react-router-dom";
import { Page } from "@/shared/ui/Page/Page";

interface BoardDetailPageProps {
	className?: string;
}

const BoardDetailPage = memo(({ className }: BoardDetailPageProps) => {
	const { boardId } = useParams<{ boardId: string }>();
	console.log("boardId: ", boardId);
	return (
		<Page className={classNames(cls.boardDetailPage, {}, [className])}>
			{/* Содержимое BoardDetailPage */}
		</Page>
	);
});

export default BoardDetailPage;
