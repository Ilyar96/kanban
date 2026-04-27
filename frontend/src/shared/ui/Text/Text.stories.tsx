import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";
import { createHiddenDarkStory } from "@/shared/config/storybook/helper/hiddenDarkStory";
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

export const PrimaryDark: Story = createHiddenDarkStory(Primary);

export const OnlyTitle: Story = {
	args: {
		title,
	},
};

export const OnlyTitleDark: Story = createHiddenDarkStory(OnlyTitle);

export const OnlyText: Story = {
	args: {
		text,
	},
};

export const OnlyTextDark: Story = createHiddenDarkStory(OnlyText);

export const Error: Story = {
	args: {
		title,
		text,
		theme: "error",
	},
};

export const ErrorDark: Story = createHiddenDarkStory(Error);

export const SizeL: Story = {
	args: {
		title,
		text,
		size: "l",
	},
};

export const SizeLDark: Story = createHiddenDarkStory(SizeL);

export const SizeM: Story = {
	args: {
		title,
		text,
		size: "m",
	},
};

export const SizeMDark: Story = createHiddenDarkStory(SizeM);

export const SizeS: Story = {
	args: {
		title,
		text,
		size: "s",
	},
};
export const SizeSDark: Story = createHiddenDarkStory(SizeS);
export const SizeXS: Story = {
	args: {
		title,
		text,
		size: "xs",
	},
};
export const SizeXSDark: Story = createHiddenDarkStory(SizeXS);
