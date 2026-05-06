import type { Board } from "@/shared/types/board";

export interface BoardDetailsResponse {
	board: Board;
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	isLastPage: boolean;
}
