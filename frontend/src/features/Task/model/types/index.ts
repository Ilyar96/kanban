import type { Task } from "@/shared/types/board";

export interface UpdateTaskRequest {
	taskId: string;
	boardId: string;
	title?: string;
	description?: string | null;
}

export interface ToggleTaskRequest {
	taskId: string;
	boardId: string;
}

export interface MoveTaskRequest {
	taskId: string;
	boardId: string;
	targetColumnId: string;
	targetPosition: number;
}

export interface CreateTaskResponse {
	task: Task;
}

export interface CreateTaskRequest {
	boardId: string;
	columnId: string;
	title: string;
	description?: string;
}
