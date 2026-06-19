import type { Meta, StoryObj } from "@storybook/react";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { TaskComment } from "./TaskComment";

const meta: Meta<typeof TaskComment> = {
	title: "entities/Comment/TaskComment",
	component: TaskComment,
	parameters: {
		layout: "centered",
	},
	tags: [],
	decorators: [ThemeDecorator(Theme.LIGHT)],
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseComment = {
	id: "comment-1",
	content: "Нужно обновить API и проверить edge cases.",
	taskId: "task-1",
	authorId: "user-1",
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	author: {
		id: "user-1",
		name: "Ilia",
		email: "ilia@example.com",
	},
};

export const Primary: Story = {
	args: {
		comment: baseComment,
		canDelete: true,
	},
	render: (args) => (
		<ul style={{ listStyle: "none", margin: 0, padding: 0, width: 520 }}>
			<TaskComment {...args} />
		</ul>
	),
};

export const ReadOnly: Story = {
	args: {
		comment: {
			...baseComment,
			author: {
				...baseComment.author,
				name: "Teammate",
			},
			authorId: "user-2",
		},
		canDelete: false,
	},
	render: Primary.render,
};

export const PrimaryDark: Story = {
	args: Primary.args,
	render: Primary.render,
	decorators: [ThemeDecorator(Theme.DARK)],
};
