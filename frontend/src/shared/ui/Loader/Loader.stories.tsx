import type { Meta, StoryObj } from "@storybook/react";
import { Loader } from "./Loader";
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

export const PrimaryDark: Story = {
	args: Primary.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const Secondary: Story = {
	args: {
		type: "secondary",
	},
};

export const SecondaryDark: Story = {
	args: Secondary.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const Accent: Story = {
	args: {
		type: "accent",
	},
};

export const AccentDark: Story = {
	args: Accent.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

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
