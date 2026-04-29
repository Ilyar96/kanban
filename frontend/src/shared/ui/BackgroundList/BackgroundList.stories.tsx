import type { Meta, StoryObj } from "@storybook/react";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { BackgroundList } from "./BackgroundList";
import { gradients } from "@/shared/const/gradients";

const meta: Meta<typeof BackgroundList> = {
	title: "shared/BackgroundList",
	component: BackgroundList,
	parameters: {
		layout: "fullscreen",
	},
	tags: [],
	decorators: [ThemeDecorator(Theme.LIGHT)],
	args: {
		backgroundList: gradients,
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const PrimaryDark: Story = {
	decorators: [ThemeDecorator(Theme.DARK)],
};
