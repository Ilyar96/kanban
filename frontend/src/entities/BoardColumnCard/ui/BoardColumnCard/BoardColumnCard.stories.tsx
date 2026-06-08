import type { Meta, StoryObj } from "@storybook/react";
import { BoardColumnCard } from "./BoardColumnCard";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const meta: Meta<typeof BoardColumnCard> = {
	title: "entities/BoardColumnCard",
	component: BoardColumnCard,
	parameters: {
		layout: "fullscreen",
	},
	tags: [],
	decorators: [ThemeDecorator(Theme.LIGHT)],
	args: {
		columnData: {
			title: "Column title",
			id: "column-1",
			tasks: [
				{
					columnId: "column-1",
					title: "Task title",
					description: "Task description",
					completed: false,
					id: "task-1",
					createdAt: "2024-06-01T12:00:00Z",
					updatedAt: "2024-06-01T12:00:00Z",
					position: 0,
					createdById: "user-1",
				},
			],
			boardId: "board-1",
			createdAt: "2024-06-01T12:00:00Z",
			updatedAt: "2024-06-01T12:00:00Z",
			position: 0,
		},
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
