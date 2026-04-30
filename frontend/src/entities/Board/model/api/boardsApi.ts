import { rtkApi } from "@/shared/api/rtkApi";
import type { BoardsResponse, GetBoardsParams } from "../types";

type GetBoardsByUserIdArgs =
	| string
	| {
			userId: string;
			params?: GetBoardsParams;
	  };

const boardsApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getBoardsByUserId: build.query<BoardsResponse, GetBoardsByUserIdArgs>({
			query: (arg) => {
				if (typeof arg === "string") {
					return {
						url: `/boards/by-owner/${arg}`,
					};
				}

				return {
					url: `/boards/by-owner/${arg.userId}`,
					params: arg.params,
				};
			},
			providesTags: (result) =>
				result?.boards
					? [
							...result.boards.flatMap(({ id }) => [
								{ type: "Board" as const, id },
								{ type: "FavoriteBoards" as const, id },
							]),
							{ type: "Board", id: "LIST" },
							{ type: "FavoriteBoards", id: "LIST" },
						]
					: [
							{ type: "Board", id: "LIST" },
							{ type: "FavoriteBoards", id: "LIST" },
						],
		}),
		addBoardToFavorite: build.mutation<void, string>({
			query: (boardId) => ({
				url: `/boards/${boardId}/favorite`,
				method: "POST",
			}),
			invalidatesTags: (_, __, boardId) => [
				{ type: "Board", id: boardId },
				{ type: "FavoriteBoards", id: boardId },
				{ type: "FavoriteBoards", id: "LIST" },
			],
		}),
		removeBoardFromFavorite: build.mutation<void, string>({
			query: (boardId) => ({
				url: `/boards/${boardId}/favorite`,
				method: "DELETE",
			}),
			invalidatesTags: (_, __, boardId) => [
				{ type: "Board", id: boardId },
				{ type: "FavoriteBoards", id: boardId },
				{ type: "FavoriteBoards", id: "LIST" },
			],
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
