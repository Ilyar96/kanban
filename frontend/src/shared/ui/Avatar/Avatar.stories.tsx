import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const meta: Meta<typeof Avatar> = {
	title: "shared/Avatar",
	component: Avatar,
	parameters: {
		layout: "fullscreen",
	},
	tags: [],
	decorators: [ThemeDecorator(Theme.LIGHT)],
	argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const PrimaryDark: Story = {
	args: Primary.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const SizeS: Story = {
	args: {
		size: "s",
	},
};

export const SizeL: Story = {
	args: {
		size: "l",
	},
};
