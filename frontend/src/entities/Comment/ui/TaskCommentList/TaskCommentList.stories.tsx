import type { Meta, StoryObj } from "@storybook/react";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { StoreDecorator } from "@/shared/config/storybook/StoreDecorator/StoreDecorator";
import { TaskCommentList } from "./TaskCommentList";

const meta: Meta<typeof TaskCommentList> = {
	title: "entities/Comment/TaskCommentList",
	component: TaskCommentList,
	parameters: {
		layout: "centered",
	},
	tags: [],
	decorators: [
		StoreDecorator({
			user: {
				authData: {
					id: "user-1",
					username: "ilia",
					email: "ilia@example.com",
					roles: ["USER"],
				},
				_inited: true,
			},
		}),
		ThemeDecorator(Theme.LIGHT),
	],
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
