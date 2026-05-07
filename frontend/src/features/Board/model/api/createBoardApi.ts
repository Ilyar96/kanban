import { rtkApi } from "@/shared/api/rtkApi";
import type { BoardResponse, CreateBoardRequest } from "../types";

const createBoardApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		createBoard: build.mutation<BoardResponse, CreateBoardRequest>({
			query: (body) => ({
				url: "/boards",
				method: "POST",
				body,
			}),
			invalidatesTags: [{ type: "Board", id: "LIST" }],
		}),
	}),
});

export const { useCreateBoardMutation } = createBoardApi;
