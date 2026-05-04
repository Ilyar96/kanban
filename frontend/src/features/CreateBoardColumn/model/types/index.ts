import type { BoardColumn } from "@/shared/types/board";

export interface BoardColumnResponse {
	column: BoardColumn;
}
export interface CreateBoardColumnRequest {
	title: string;
	boardId: string;
}
