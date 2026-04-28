import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "./Navbar";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { StoreDecorator } from "@/shared/config/storybook/StoreDecorator/StoreDecorator";

const meta: Meta<typeof Navbar> = {
	title: "widgets/Navbar",
	component: Navbar,
	parameters: {
		layout: "fullscreen",
	},
	tags: [],
	decorators: [StoreDecorator({}), ThemeDecorator(Theme.LIGHT)],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {},
};

export const PrimaryDark: Story = {
	args: Primary.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};
