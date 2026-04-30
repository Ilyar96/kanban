import type { Board, BoardVisibility } from "@/shared/types/board";

export interface CreateBoardRequest {
	title: string;
	description?: string;
	visibility?: BoardVisibility;
	backgroundColor?: string;
	isFavorite?: boolean;
}

export interface BoardResponse {
	board: Board;
}
