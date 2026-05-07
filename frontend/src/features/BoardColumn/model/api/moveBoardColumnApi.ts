import { rtkApi } from "@/shared/api/rtkApi";
import type { MoveBoardColumnRequest } from "../types";

const moveBoardColumnApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		moveBoardColumn: build.mutation<void, MoveBoardColumnRequest>({
			query: ({ columnId, ...body }) => ({
				url: `/columns/${columnId}/move`,
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

export const { useMoveBoardColumnMutation } = moveBoardColumnApi;
