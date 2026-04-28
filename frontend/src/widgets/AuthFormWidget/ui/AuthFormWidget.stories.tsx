import type { Meta, StoryObj } from "@storybook/react";
import { AuthFormWidget } from "./AuthFormWidget";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const meta: Meta<typeof AuthFormWidget> = {
	title: "widgets/AuthFormWidget",
	component: AuthFormWidget,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [ThemeDecorator(Theme.LIGHT)],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RegisterWidget: Story = {};

export const RegisterWidgetDark: Story = {
	args: RegisterWidget.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const LoginWidget: Story = {
	args: {
		type: "login",
	},
};

export const LoginWidgetDark: Story = {
	args: LoginWidget.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};
