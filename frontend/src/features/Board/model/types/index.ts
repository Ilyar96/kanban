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

export type BoardInvitationRole = "EDITOR" | "MOVER";

export interface BoardInvitation {
	id: string;
	boardId: string;
	email: string;
	role: BoardInvitationRole;
	token: string;
	status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
	invitedById: string;
	expiresAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateBoardInvitationRequest {
	boardId: string;
	email: string;
	role: BoardInvitationRole;
	expiresInDays?: number;
}

export interface BoardInvitationResponse {
	invitation: BoardInvitation;
}

export interface BoardInvitationsResponse {
	invitations: BoardInvitation[];
}

export interface AcceptBoardInvitationRequest {
	token: string;
	boardId?: string;
}

export interface AcceptBoardInvitationResponse {
	message: string;
}

export interface DeleteBoardInvitationRequest {
	boardId: string;
	invitationId: string;
}
