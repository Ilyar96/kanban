import type { Meta, StoryObj } from "@storybook/react";
import { AuthFormWidget } from "./AuthFormWidget";
import { createHiddenDarkStory } from "@/shared/config/storybook/helper/hiddenDarkStory";
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

export const RegisterWidgetDark: Story = createHiddenDarkStory(RegisterWidget);

export const LoginWidget: Story = {
	args: {
		type: "login",
	},
};

export const LoginWidgetDark: Story = createHiddenDarkStory(LoginWidget);
