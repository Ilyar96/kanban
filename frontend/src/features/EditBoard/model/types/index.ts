import type { Board, BoardVisibility } from "@/shared/types/board";

export interface UpdateBoardRequest {
	boardId: string;
	title: string;
	description?: string | null;
	visibility?: BoardVisibility;
	backgroundColor?: string | null;
}

export interface UpdateBoardResponse {
	board: Board;
}
