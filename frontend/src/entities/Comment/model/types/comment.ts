export interface CommentAuthor {
	id: string;
	name: string;
	email: string;
}

export interface Comment {
	id: string;
	content: string;
	taskId: string;
	authorId: string;
	createdAt: string;
	updatedAt: string;
	author: CommentAuthor;
}

export interface TaskCommentsResponse {
	comments: Comment[];
}

export interface GetTaskCommentsRequest {
	taskId: string;
}

export interface CreateTaskCommentRequest {
	taskId: string;
	content: string;
}

export interface CreateTaskCommentResponse {
	comment: Comment;
}

export interface DeleteTaskCommentRequest {
	taskId: string;
	commentId: string;
}
