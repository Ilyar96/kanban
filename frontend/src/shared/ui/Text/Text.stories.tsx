import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const title = "Заголовок";
const text = "Некоторое описание";

const meta: Meta<typeof Text> = {
	title: "shared/Text",
	component: Text,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [ThemeDecorator(Theme.LIGHT)],
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Primary: Story = {
	args: {
		title,
		text,
	},
};

export const PrimaryDark: Story = {
	args: Primary.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const OnlyTitle: Story = {
	args: {
		title,
	},
};

export const OnlyTitleDark: Story = {
	args: OnlyTitle.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const OnlyText: Story = {
	args: {
		text,
	},
};

export const OnlyTextDark: Story = {
	args: OnlyText.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const Error: Story = {
	args: {
		title,
		text,
		theme: "error",
	},
};

export const ErrorDark: Story = {
	args: Error.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const SizeL: Story = {
	args: {
		title,
		text,
		size: "l",
	},
};

export const SizeLDark: Story = {
	args: SizeL.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const SizeM: Story = {
	args: {
		title,
		text,
		size: "m",
	},
};

export const SizeMDark: Story = {
	args: SizeM.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const SizeS: Story = {
	args: {
		title,
		text,
		size: "s",
	},
};
export const SizeSDark: Story = {
	args: SizeS.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};
export const SizeXS: Story = {
	args: {
		title,
		text,
		size: "xs",
	},
};
export const SizeXSDark: Story = {
	args: SizeXS.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};
