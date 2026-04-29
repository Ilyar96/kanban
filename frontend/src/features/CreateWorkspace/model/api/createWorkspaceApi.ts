import { rtkApi } from "@/shared/api/rtkApi";

type BoardVisibility = "PRIVATE" | "WORKSPACE" | "PUBLIC";

interface CreateWorkspaceRequest {
	title: string;
	description?: string;
	visibility?: BoardVisibility;
	backgroundColor?: string;
	isFavorite?: boolean;
}

interface BoardResponse {
	board: {
		id: string;
		title: string;
		description: string | null;
		visibility: BoardVisibility;
		backgroundColor: string | null;
		isFavorite: boolean;
	};
}

const createWorkspaceApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		createWorkspace: build.mutation<BoardResponse, CreateWorkspaceRequest>({
			query: (body) => ({
				url: "/boards",
				method: "POST",
				body,
			}),
		}),
	}),
});

export const { useCreateWorkspaceMutation } = createWorkspaceApi;
