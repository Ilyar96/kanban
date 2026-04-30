import type { Meta, StoryObj } from "@storybook/react";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { Theme } from "@/app/providers/ThemeProvider";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
	title: "shared/Skeleton",
	component: Skeleton,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [ThemeDecorator(Theme.LIGHT)],
	argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		width: "100%",
		height: 200,
	},
};

export const Dark: Story = {
	args: {
		width: "100%",
		height: 200,
	},
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const Circle: Story = {
	args: {
		borderRadius: "50%",
		width: 100,
		height: 100,
	},
};

export const CircleDark: Story = {
	args: {
		borderRadius: "50%",
		width: 100,
		height: 100,
	},
	decorators: [ThemeDecorator(Theme.DARK)],
};
