export interface BoardColumnParams {
	boardId: string;
	columnId: string;
}

export interface UpdateBoardColumnRequest extends BoardColumnParams {
	title: string;
}

export interface MoveBoardColumnRequest extends BoardColumnParams {
	targetPosition: number;
}
