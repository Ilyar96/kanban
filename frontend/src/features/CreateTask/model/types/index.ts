import type { Task } from "@/shared/types/board";

export interface TaskResponse {
	task: Task;
}

export interface CreateTaskRequest {
	boardId: string;
	columnId: string;
	title: string;
	description?: string;
}
