import type { Meta, StoryObj } from "@storybook/react";
import { TextField, type TextFieldProps } from "./TextField";
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
		fieldSize: "m",
		error: "Ошибка ввода",
	},
	decorators: [ThemeDecorator(Theme.LIGHT)],
} satisfies Meta<TextFieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const PrimaryDark: Story = {
	args: Primary.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const SizeS: Story = {
	args: {
		fieldSize: "s",
	},
};

export const SizeSDark: Story = {
	args: SizeS.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const SizeM: Story = {
	args: {
		fieldSize: "m",
	},
};

export const SizeMDark: Story = {
	args: SizeM.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const SizeL: Story = {
	args: {
		fieldSize: "l",
	},
};

export const SizeLDark: Story = {
	args: SizeL.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};
