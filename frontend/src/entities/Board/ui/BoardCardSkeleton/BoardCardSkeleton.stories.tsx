import type { Meta, StoryObj } from "@storybook/react";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { BoardCardSkeleton } from "./BoardCardSkeleton";

const meta: Meta<typeof BoardCardSkeleton> = {
	title: "entities/Board/BoardCardSkeleton",
	component: BoardCardSkeleton,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [ThemeDecorator(Theme.LIGHT)],
	args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const PrimaryDark: Story = {
	decorators: [ThemeDecorator(Theme.DARK)],
};
