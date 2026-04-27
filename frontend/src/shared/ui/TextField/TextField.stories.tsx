import type { Meta, StoryObj } from "@storybook/react";
import { TextField, type TextFieldProps } from "./TextField";
import { createHiddenDarkStory } from "@/shared/config/storybook/helper/hiddenDarkStory";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const meta = {
	title: "shared/TextField",
	component: TextField,
	parameters: {
		layout: "fullscreen",
	},
	args: {
		placeholder: "Введите текст",
		label: "Текстовое поле",
		size: "m",
		error: "Ошибка ввода",
	},
	decorators: [ThemeDecorator(Theme.LIGHT)],
} satisfies Meta<TextFieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const PrimaryDark: Story = createHiddenDarkStory(Primary);

export const SizeS: Story = {
	args: {
		size: "s",
	},
};

export const SizeSDark: Story = createHiddenDarkStory(SizeS);

export const SizeM: Story = {
	args: {
		size: "m",
	},
};

export const SizeMDark: Story = createHiddenDarkStory(SizeM);

export const SizeL: Story = {
	args: {
		size: "l",
	},
};

export const SizeLDark: Story = createHiddenDarkStory(SizeL);
