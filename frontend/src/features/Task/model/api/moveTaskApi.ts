import { rtkApi } from "@/shared/api/rtkApi";
import type { MoveTaskRequest } from "../types";

const moveTaskApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		moveTask: build.mutation<void, MoveTaskRequest>({
			query: ({ taskId, ...body }) => ({
				url: `/tasks/${taskId}/move`,
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

export const { useMoveTaskMutation } = moveTaskApi;
