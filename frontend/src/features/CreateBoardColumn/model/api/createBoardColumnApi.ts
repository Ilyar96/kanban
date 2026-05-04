import { rtkApi } from "@/shared/api/rtkApi";
import type { BoardColumnResponse, CreateBoardColumnRequest } from "../types";

const createBoardColumnApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		createBoardColumn: build.mutation<BoardColumnResponse, CreateBoardColumnRequest>({
			query: ({ boardId, ...body }) => ({
				url: `/columns/boards/${boardId}/columns`,
				method: "POST",
				body,
			}),
			invalidatesTags: [{ type: "Board", id: "LIST" }],
		}),
	}),
});

export const { useCreateBoardColumnMutation } = createBoardColumnApi;
