import type { Meta, StoryObj } from "@storybook/react";
import { MoreActionsButton } from "./MoreActionsButton";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const meta: Meta<typeof MoreActionsButton> = {
	title: "shared/MoreActionsButton",
	component: MoreActionsButton,
	parameters: {
		layout: "fullscreen",
	},
	tags: [],
	decorators: [ThemeDecorator(Theme.LIGHT)],
	argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
	args: {},
};

export const VerticalDark: Story = {
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const Horizontal: Story = {
	args: { type: "horizontal" },
};

export const HorizontalDark: Story = {
	args: { type: "horizontal" },
	decorators: [ThemeDecorator(Theme.DARK)],
};
