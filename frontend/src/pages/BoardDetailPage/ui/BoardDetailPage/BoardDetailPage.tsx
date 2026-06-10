import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback, useState } from "react";
import { Page } from "@/shared/ui/Page/Page";
import { Container } from "@/shared/ui/Container/Container";
import { BoardDetails } from "@/widgets/BoardDetails";
import { TaskDetailsModal } from "@/widgets/TaskDetailsModal";
import type { Task } from "@/shared/types/board";
import { useParams } from "react-router-dom";
import cls from "./BoardDetailPage.module.scss";

interface BoardDetailPageProps {
	className?: string;
}

const BoardDetailPage = memo(({ className }: BoardDetailPageProps) => {
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const { boardId } = useParams<{ boardId: string }>();

	const handleTaskClick = useCallback((task: Task) => {
		setSelectedTask(task);
	}, []);

	const handleCloseTaskModal = useCallback(() => {
		setSelectedTask(null);
	}, []);

	return (
		<Page className={classNames("", {}, [className])}>
			<Container
				className={cls.container}
				type="max"
			>
				<BoardDetails onTaskClick={handleTaskClick} />
				{boardId && (
					<TaskDetailsModal
						isOpen={Boolean(selectedTask)}
						boardId={boardId}
						task={selectedTask}
						onClose={handleCloseTaskModal}
					/>
				)}
			</Container>
		</Page>
	);
});

export default BoardDetailPage;
