import type { Task } from "@/shared/types/board";

export interface UpdateTaskRequest extends Task {
	taskId: string;
	boardId: string;
}

export interface ToggleTaskRequest {
	taskId: string;
	boardId: string;
}
