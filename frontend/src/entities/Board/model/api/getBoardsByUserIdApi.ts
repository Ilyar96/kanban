import { rtkApi } from "@/shared/api/rtkApi";
import type { BoardsResponse } from "../types";

const getBoardsByUserIdApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getBoardsByUserId: build.query<BoardsResponse, string>({
			query: (userId) => ({
				url: `/boards/by-owner/${userId}`,
			}),
			providesTags: (result) =>
				result?.boards
					? [
							...result.boards.map(({ id }) => ({ type: "Board" as const, id })),
							{ type: "Board", id: "LIST" },
						]
					: [{ type: "Board", id: "LIST" }],
		}),
	}),
});

export const { useGetBoardsByUserIdQuery } = getBoardsByUserIdApi;
