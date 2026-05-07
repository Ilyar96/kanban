import { rtkApi } from "@/shared/api/rtkApi";
import type { CreateTaskResponse, CreateTaskRequest } from "../types";

const createTaskApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		createTask: build.mutation<CreateTaskResponse, CreateTaskRequest>({
			query: ({ columnId, title, description }) => ({
				url: `/tasks/columns/${columnId}/tasks`,
				method: "POST",
				body: {
					title,
					description,
				},
			}),
			invalidatesTags: (_, __, { boardId }) => [
				{ type: "Board", id: boardId },
				{ type: "Board", id: "LIST" },
			],
		}),
	}),
});

export const { useCreateTaskMutation } = createTaskApi;
