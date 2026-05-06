import { rtkApi } from "@/shared/api/rtkApi";
import type { BoardDetailsResponse } from "../types";

const boardsDetailsApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getBoardsDetails: build.query<BoardDetailsResponse, string | undefined>({
			query: (boardId) => {
				return {
					url: `/boards/${boardId}`,
				};
			},
			providesTags: (_, __, boardId) =>
				boardId
					? [
							{ type: "Board", id: boardId },
							{ type: "Board", id: "LIST" },
						]
					: [{ type: "Board", id: "LIST" }],
		}),
	}),
});

export const { useGetBoardsDetailsQuery } = boardsDetailsApi;
