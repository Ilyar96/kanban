import type { Meta, StoryObj } from "@storybook/react";
import { BoardCard } from "./BoardCard";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const meta: Meta<typeof BoardCard> = {
	title: "entities/Board/BoardCard",
	component: BoardCard,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [ThemeDecorator(Theme.LIGHT)],
	args: {
		title: "Доска 1",
		background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		to: "main",
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
