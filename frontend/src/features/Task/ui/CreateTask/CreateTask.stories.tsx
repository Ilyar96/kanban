import type { Meta, StoryObj } from "@storybook/react";
import { CreateTask } from "./CreateTask";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const meta: Meta<typeof CreateTask> = {
	title: "features/Task/CreateTask",
	component: CreateTask,
	parameters: {
		layout: "fullscreen",
	},
	tags: [],
	decorators: [ThemeDecorator(Theme.LIGHT)],
	argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {},
};

export const PrimaryDark: Story = {
	decorators: [ThemeDecorator(Theme.DARK)],
};
