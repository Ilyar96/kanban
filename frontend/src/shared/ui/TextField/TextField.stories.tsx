import type { Meta, StoryObj } from "@storybook/react";
import { TextField, type TextFieldProps } from "./TextField";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { Theme } from "@/app/providers/ThemeProvider";

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
	decorators: [ThemeDecorator(Theme.DARK)],
} satisfies Meta<TextFieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

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
