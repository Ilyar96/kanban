import { rtkApi } from "@/shared/api/rtkApi";
import type { BoardsResponse } from "../types";

const boardsApi = rtkApi.injectEndpoints({
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
		addBoardToFavorite: build.mutation<void, { boardId: string; favorite: boolean }>({
			query: ({ boardId, favorite }) => ({
				url: `/boards/${boardId}/favorite`,
				method: "POST",
				body: { favorite },
			}),
			invalidatesTags: (_, __, { boardId }) => [{ type: "Board", id: boardId }],
		}),
		removeBoardFromFavorite: build.mutation<void, string>({
			query: (boardId) => ({
				url: `/boards/${boardId}/favorite`,
				method: "DELETE",
			}),
			invalidatesTags: (_, __, boardId) => [{ type: "Board", id: boardId }],
		}),
		deleteBoard: build.mutation<void, string>({
			query: (boardId) => ({
				url: `/boards/${boardId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_, __, boardId) => [
				{ type: "Board", id: boardId },
				{ type: "Board", id: "LIST" },
			],
		}),
	}),
});

export const {
	useGetBoardsByUserIdQuery,
	useAddBoardToFavoriteMutation,
	useRemoveBoardFromFavoriteMutation,
	useDeleteBoardMutation,
} = boardsApi;
