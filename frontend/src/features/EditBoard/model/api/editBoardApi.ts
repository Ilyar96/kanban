import { rtkApi } from "@/shared/api/rtkApi";
import type { UpdateBoardRequest, UpdateBoardResponse } from "../types";

const editBoardApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		updateBoard: build.mutation<UpdateBoardResponse, UpdateBoardRequest>({
			query: ({ boardId, ...body }) => ({
				url: `/boards/${boardId}`,
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

export const { useUpdateBoardMutation } = editBoardApi;
