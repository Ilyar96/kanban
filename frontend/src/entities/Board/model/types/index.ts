import type { Board } from "@/shared/types/board";

export interface BoardsResponse {
	boards: Board[];
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	isLastPage: boolean;
}

export interface GetBoardsParams {
	page?: number;
	limit?: number;
	favoritesOnly?: boolean;
	sortBy?: "updatedAt" | "createdAt" | "title";
	sortOrder?: "asc" | "desc";
}

export interface BoardsPageResponse extends BoardsResponse {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	isLastPage: boolean;
}

export type GetBoardsByUserIdArgs =
	| string
	| {
			userId: string;
			params?: GetBoardsParams;
	  };
