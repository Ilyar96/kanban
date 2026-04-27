import type { Meta, StoryObj } from "@storybook/react";
import { Loader } from "./Loader";
import { createHiddenDarkStory } from "@/shared/config/storybook/helper/hiddenDarkStory";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const meta: Meta<typeof Loader> = {
	title: "shared/Loader",
	component: Loader,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [ThemeDecorator(Theme.LIGHT)],
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Primary: Story = {};

export const PrimaryDark: Story = createHiddenDarkStory(Primary);

export const Secondary: Story = {
	args: {
		type: "secondary",
	},
};

export const SecondaryDark: Story = createHiddenDarkStory(Secondary);

export const Accent: Story = {
	args: {
		type: "accent",
	},
};

export const AccentDark: Story = createHiddenDarkStory(Accent);

export const SizeS: Story = {
	args: {
		size: "s",
	},
};
export const SizeM: Story = {
	args: {
		size: "m",
	},
};
export const SizeL: Story = {
	args: {
		size: "l",
	},
};
