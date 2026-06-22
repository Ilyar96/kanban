import { rtkApi } from "@/shared/api/rtkApi";
import type {
	AcceptBoardInvitationRequest,
	AcceptBoardInvitationResponse,
	BoardInvitationsResponse,
	BoardInvitationResponse,
	CreateBoardInvitationRequest,
	DeleteBoardInvitationRequest,
} from "../types";

const invitationsApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		getBoardInvitations: build.query<BoardInvitationsResponse, string>({
			query: (boardId) => ({
				url: `/boards/${boardId}/invitations`,
			}),
			providesTags: (_, __, boardId) => [{ type: "Board", id: boardId }],
		}),
		createBoardInvitation: build.mutation<BoardInvitationResponse, CreateBoardInvitationRequest>({
			query: ({ boardId, ...body }) => ({
				url: `/boards/${boardId}/invitations`,
				method: "POST",
				body,
			}),
			invalidatesTags: (_, __, { boardId }) => [{ type: "Board", id: boardId }],
		}),
		deleteBoardInvitation: build.mutation<void, DeleteBoardInvitationRequest>({
			query: ({ boardId, invitationId }) => ({
				url: `/boards/${boardId}/invitations/${invitationId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_, __, { boardId }) => [{ type: "Board", id: boardId }],
		}),
		acceptBoardInvitation: build.mutation<
			AcceptBoardInvitationResponse,
			AcceptBoardInvitationRequest
		>({
			query: ({ token }) => ({
				url: `/invitations/${token}/accept`,
				method: "POST",
			}),
			invalidatesTags: (_, __, { boardId }) => [
				{ type: "Board", id: boardId ?? "LIST" },
				{ type: "Board", id: "LIST" },
			],
		}),
	}),
});

export const {
	useGetBoardInvitationsQuery,
	useCreateBoardInvitationMutation,
	useDeleteBoardInvitationMutation,
	useAcceptBoardInvitationMutation,
} = invitationsApi;
