import { rtkApi } from "@/shared/api/rtkApi";

type BoardVisibility = "PRIVATE" | "WORKSPACE" | "PUBLIC";

interface CreateBoardRequest {
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

const createBoardApi = rtkApi.injectEndpoints({
	endpoints: (build) => ({
		createBoard: build.mutation<BoardResponse, CreateBoardRequest>({
			query: (body) => ({
				url: "/boards",
				method: "POST",
				body,
			}),
		}),
	}),
});

export const { useCreateBoardMutation } = createBoardApi;
