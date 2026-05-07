import { rtkApi } from "@/shared/api/rtkApi";
import type { ToggleTaskRequest, UpdateTaskRequest } from "../types";

const updateTaskApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		updateTask: build.mutation<void, UpdateTaskRequest>({
			query: ({ taskId, ...body }) => ({
				url: `/tasks/${taskId}`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: (_, __, { boardId }) => [
				{ type: "Board", id: boardId },
				{ type: "Board", id: "LIST" },
			],
		}),
		toggleTaskCompleted: build.mutation<void, ToggleTaskRequest>({
			query: ({ taskId, ...body }) => ({
				url: `/tasks/${taskId}/toggle`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: (_, __, { boardId }) => [
				{ type: "Board", id: boardId },
				{ type: "Board", id: "LIST" },
			],
		}),
	}),
});

export const { useUpdateTaskMutation, useToggleTaskCompletedMutation } = updateTaskApi;
