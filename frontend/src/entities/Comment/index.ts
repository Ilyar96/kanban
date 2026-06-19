export type {
	Comment,
	CommentAuthor,
	CreateTaskCommentRequest,
	CreateTaskCommentResponse,
	DeleteTaskCommentRequest,
	GetTaskCommentsRequest,
	TaskCommentsResponse,
} from "./model/types/comment";

export {
	useCreateTaskCommentMutation,
	useDeleteTaskCommentMutation,
	useGetTaskCommentsQuery,
} from "./model/api/commentApi";

export { TaskComment } from "./ui/TaskComment/TaskComment";
export { TaskCommentList } from "./ui/TaskCommentList/TaskCommentList";
