import { rtkApi } from "@/shared/api/rtkApi";
import type { BoardsResponse } from "../types";

const getBoardsByUserIdApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getBoardsByUserId: build.query<BoardsResponse, string>({
			query: (userId) => ({
				url: `/boards/by-owner/${userId}`,
			}),
		}),
	}),
});

export const { useGetBoardsByUserIdQuery } = getBoardsByUserIdApi;
