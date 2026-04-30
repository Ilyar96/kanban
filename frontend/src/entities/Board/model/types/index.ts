import type { Board } from "@/shared/types/board";

export interface BoardsResponse {
	boards: Board[];
}

export interface GetBoardsParams {
	page?: number;
	limit?: number;
	favoritesOnly?: boolean;
}

export interface BoardsPageResponse extends BoardsResponse {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	isLastPage: boolean;
}
