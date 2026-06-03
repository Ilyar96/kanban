import type { Meta, StoryObj } from "@storybook/react";
import { CreateItemForm } from "./CreateItemForm";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const meta: Meta<typeof CreateItemForm> = {
	title: "shared/CreateItemForm",
	component: CreateItemForm,
	parameters: {
		layout: "fullscreen",
	},
	tags: [],
	decorators: [ThemeDecorator(Theme.LIGHT)],
	args: {
		isCard: true,
		titlePlaceholder: "Введите название колонки",
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
