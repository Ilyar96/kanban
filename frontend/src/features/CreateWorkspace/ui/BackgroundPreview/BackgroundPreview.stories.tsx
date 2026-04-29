import type { Meta, StoryObj } from "@storybook/react";
import { BackgroundPreview } from "./BackgroundPreview";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const meta: Meta<typeof BackgroundPreview> = {
	title: "features/CreateWorkspace/BackgroundPreview",
	component: BackgroundPreview,
	parameters: {
		layout: "fullscreen",
	},
	tags: [],
	decorators: [ThemeDecorator(Theme.LIGHT)],
	argTypes: {
		background: { control: "color" },
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
