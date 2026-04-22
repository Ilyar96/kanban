import type { Meta, StoryObj } from "@storybook/react";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { Theme } from "@/app/providers/ThemeProvider";
import { Text } from "./Text";

const title = "Заголовок";
const text = "Некоторое описание";

const meta: Meta<typeof Text> = {
	title: "shared/Text",
	component: Text,
	parameters: {
		layout: "fullscreen",
	},
	args: {},
	decorators: [ThemeDecorator(Theme.DARK)],
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Primary: Story = {
	args: {
		title,
		text,
	},
};

export const OnlyTitle: Story = {
	args: {
		title,
	},
};

export const OnlyText: Story = {
	args: {
		text,
	},
};

export const Error: Story = {
	args: {
		title,
		text,
		theme: "error",
	},
};

export const SizeL: Story = {
	args: {
		title,
		text,
		size: "l",
	},
};

export const SizeM: Story = {
	args: {
		title,
		text,
		size: "m",
	},
};

export const SizeS: Story = {
	args: {
		title,
		text,
		size: "s",
	},
};
export const SizeXS: Story = {
	args: {
		title,
		text,
		size: "xs",
	},
};
