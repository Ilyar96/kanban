import type { Meta, StoryObj } from "@storybook/react";
import { Task } from "./Task";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const meta: Meta<typeof Task> = {
	title: "shared/Task",
	component: Task,
	parameters: {
		layout: "fullscreen",
	},
	tags: [],
	decorators: [ThemeDecorator(Theme.LIGHT)],
	args: {
		text: "task",
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
