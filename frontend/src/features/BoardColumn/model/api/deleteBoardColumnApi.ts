import { rtkApi } from "@/shared/api/rtkApi";
import type { BoardColumnParams } from "../types";

const deleteBoardColumnApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		deleteBoardColumn: build.mutation<void, BoardColumnParams>({
			query: ({ columnId, ...body }) => ({
				url: `/columns/${columnId}`,
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

export const { useDeleteBoardColumnMutation } = deleteBoardColumnApi;
