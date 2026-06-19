import { rtkApi } from "@/shared/api/rtkApi";
import type {
	CreateTaskCommentRequest,
	CreateTaskCommentResponse,
	DeleteTaskCommentRequest,
	GetTaskCommentsRequest,
	TaskCommentsResponse,
} from "../types/comment";

const commentApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getTaskComments: build.query<TaskCommentsResponse, GetTaskCommentsRequest>({
			query: ({ taskId }) => ({
				url: `/tasks/${taskId}/comments`,
			}),
			providesTags: (_, __, { taskId }) => [{ type: "TaskComments", id: taskId }],
		}),
		createTaskComment: build.mutation<CreateTaskCommentResponse, CreateTaskCommentRequest>({
			query: ({ taskId, content }) => ({
				url: `/tasks/${taskId}/comments`,
				method: "POST",
				body: { content },
			}),
			invalidatesTags: (_, __, { taskId }) => [{ type: "TaskComments", id: taskId }],
		}),
		deleteTaskComment: build.mutation<void, DeleteTaskCommentRequest>({
			query: ({ taskId, commentId }) => ({
				url: `/tasks/${taskId}/comments/${commentId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_, __, { taskId }) => [{ type: "TaskComments", id: taskId }],
		}),
	}),
});

export const {
	useGetTaskCommentsQuery,
	useCreateTaskCommentMutation,
	useDeleteTaskCommentMutation,
} = commentApi;
