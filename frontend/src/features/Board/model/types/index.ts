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

export interface UpdateBoardRequest {
	boardId: string;
	title: string;
	description?: string | null;
	visibility?: BoardVisibility;
	backgroundColor?: string | null;
}
