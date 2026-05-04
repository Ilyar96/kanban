import type { Meta, StoryObj } from "@storybook/react";
import { BoardList } from "./BoardList";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import type { Board } from "@/shared/types/board";

const board: Board = {
	id: "cmolj165c0005fe9kv49mzdw3",
	title: "Test",
	description: null,
	visibility: "PRIVATE",
	backgroundColor: "linear-gradient(145.4deg, #0c66e4 2%, #09326c 100%)",
	ownerId: "cmo6ylo9v0000fe4s7tj1tqd3",
	createdAt: "2026-04-30T13:35:43.201Z",
	updatedAt: "2026-04-30T13:35:43.201Z",
	owner: {
		id: "cmo6ylo9v0000fe4s7tj1tqd3",
		name: "admin",
		email: "admin@example.com",
	},
	_count: {
		columns: 1,
		members: 0,
	},
	isFavorite: true,
};

const meta: Meta<typeof BoardList> = {
	title: "entities/Board/BoardList",
	component: BoardList,
	parameters: {
		layout: "fullscreen",
	},
	tags: [],
	decorators: [ThemeDecorator(Theme.LIGHT)],
	args: {
		data: [board, { ...board, id: "2", title: "Test 2" }, { ...board, id: "3", title: "Test 3" }],
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {},
};

export const PrimaryDark: Story = {
	decorators: [ThemeDecorator(Theme.DARK)],
};
