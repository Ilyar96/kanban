import { rtkApi } from "@/shared/api/rtkApi";
import type { UpdateBoardColumnRequest } from "../types";

const updateBoardColumnApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		updateBoardColumn: build.mutation<void, UpdateBoardColumnRequest>({
			query: ({ columnId, ...body }) => ({
				url: `/columns/${columnId}`,
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

export const { useUpdateBoardColumnMutation } = updateBoardColumnApi;
