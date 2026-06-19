import type { Meta, StoryObj } from "@storybook/react";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { StoreDecorator } from "@/shared/config/storybook/StoreDecorator/StoreDecorator";
import { CreateTaskComment } from "./CreateTaskComment";

const meta: Meta<typeof CreateTaskComment> = {
	title: "features/TaskComment/CreateTaskComment",
	component: CreateTaskComment,
	parameters: {
		layout: "centered",
	},
	tags: [],
	decorators: [StoreDecorator({}), ThemeDecorator(Theme.LIGHT)],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		taskId: "task-1",
	},
};

export const PrimaryDark: Story = {
	args: Primary.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};
