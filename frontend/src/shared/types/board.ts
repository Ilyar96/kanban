export type BoardVisibility = "PRIVATE" | "WORKSPACE" | "PUBLIC";

export interface Board {
	id: string;
	title: string;
	description: string | null;
	visibility: BoardVisibility;
	backgroundColor: string;
	isFavorite?: boolean;
	ownerId: string;
	createdAt: string;
	updatedAt: string;
	owner?: Owner;
	_count?: Count;
}

export interface Owner {
	id: string;
	name: string;
	email: string;
}

export interface Count {
	columns: number;
	members: number;
}

export interface BoardColumn {
	id: string;
	title: string;
	position: number;
	boardId: string;
	createdAt: string;
	updatedAt: string;
}
