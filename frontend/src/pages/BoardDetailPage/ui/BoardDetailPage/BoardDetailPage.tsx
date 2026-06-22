import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Page } from "@/shared/ui/Page/Page";
import { Container } from "@/shared/ui/Container/Container";
import { BoardDetails } from "@/widgets/BoardDetails";
import { TaskDetailsModal } from "@/widgets/TaskDetailsModal";
import type { Task } from "@/shared/types/board";
import { useParams, useSearchParams } from "react-router-dom";
import { useAcceptBoardInvitationMutation } from "@/features/Board";
import { appToast } from "@/shared/lib/toast";
import { getServerErrorMessage } from "@/shared/lib/serverError/serverError";
import cls from "./BoardDetailPage.module.scss";

interface BoardDetailPageProps {
	className?: string;
}

const BoardDetailPage = memo(({ className }: BoardDetailPageProps) => {
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const { boardId } = useParams<{ boardId: string }>();
	const [searchParams, setSearchParams] = useSearchParams();
	const inviteToken = searchParams.get("invite");
	const handledInviteTokenRef = useRef<string | null>(null);
	const [acceptBoardInvitation] = useAcceptBoardInvitationMutation();

	const handleTaskClick = useCallback((task: Task) => {
		setSelectedTask(task);
	}, []);

	const handleCloseTaskModal = useCallback(() => {
		setSelectedTask(null);
	}, []);

	useEffect(() => {
		if (!boardId || !inviteToken) {
			return;
		}

		if (handledInviteTokenRef.current === inviteToken) {
			return;
		}

		handledInviteTokenRef.current = inviteToken;

		const clearInviteQuery = () => {
			const nextParams = new URLSearchParams(searchParams);
			nextParams.delete("invite");
			setSearchParams(nextParams, { replace: true });
		};

		const acceptInvite = async () => {
			try {
				await acceptBoardInvitation({ token: inviteToken, boardId }).unwrap();
				appToast.success("Приглашение принято. Доступ к доске выдан.");
			} catch (error) {
				appToast.error(getServerErrorMessage(error) ?? "Не удалось принять приглашение");
			} finally {
				clearInviteQuery();
			}
		};

		void acceptInvite();
	}, [acceptBoardInvitation, boardId, inviteToken, searchParams, setSearchParams]);

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
