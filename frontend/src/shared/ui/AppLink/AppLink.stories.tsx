import { createHiddenDarkStory } from "@/shared/config/storybook/helper/hiddenDarkStory";
import { RoutePaths } from "@/shared/const/router";
import type { Meta, StoryObj } from "@storybook/react";
import { AppLink } from "./AppLink";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { Theme } from "@/app/providers/ThemeProvider";

const meta: Meta<typeof AppLink> = {
	title: "shared/AppLink",
	component: AppLink,
	parameters: {
		layout: "fullscreen",
	},
	args: {
		children: "Text",
		theme: "primary",
		to: RoutePaths.main,
	},
	decorators: [ThemeDecorator(Theme.LIGHT)],
};

export default meta;
type Story = StoryObj<typeof AppLink>;

export const Primary: Story = {};

export const PrimaryDark: Story = createHiddenDarkStory(Primary);

export const Secondary: Story = {
	args: {
		theme: "secondary",
	},
};

export const SecondaryDark: Story = createHiddenDarkStory(Secondary);
