import type { Meta, StoryObj } from "@storybook/react";
import RegisterPage from "./RegisterPage";
import { PageFullHeightDecorator } from "@/shared/config/storybook/PageFullHeightDecorator/PageFullHeightDecorator";
import { StoreDecorator } from "@/shared/config/storybook/StoreDecorator/StoreDecorator";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { Theme } from "@/app/providers/ThemeProvider";

const meta: Meta<typeof RegisterPage> = {
	title: "pages/RegisterPage",
	component: RegisterPage,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		PageFullHeightDecorator,
		ThemeDecorator(Theme.LIGHT),
		StoreDecorator({
			user: {
				_inited: true,
			},
		}),
	],
	argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const PrimaryDark: Story = {
	decorators: [
		PageFullHeightDecorator,
		ThemeDecorator(Theme.DARK),
		StoreDecorator({
			user: {
				_inited: true,
			},
		}),
	],
};
