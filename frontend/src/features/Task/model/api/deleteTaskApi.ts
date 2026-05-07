import { rtkApi } from "@/shared/api/rtkApi";
import type { UpdateTaskRequest } from "../types";

const deleteTaskApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		deleteTask: build.mutation<void, UpdateTaskRequest>({
			query: ({ taskId, ...body }) => ({
				url: `/tasks/${taskId}`,
				method: "DELETE",
				body,
			}),
			invalidatesTags: (_, __, { boardId }) => [
				{ type: "Board", id: boardId },
				{ type: "Board", id: "LIST" },
			],
		}),
	}),
});

export const { useDeleteTaskMutation } = deleteTaskApi;
