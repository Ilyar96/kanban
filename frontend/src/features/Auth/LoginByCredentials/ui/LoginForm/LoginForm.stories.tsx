import type { Meta, StoryObj } from "@storybook/react";
import { LoginForm } from "./LoginForm";
import { createHiddenDarkStory } from "@/shared/config/storybook/helper/hiddenDarkStory";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { Theme } from "@/app/providers/ThemeProvider";

const meta: Meta<typeof LoginForm> = {
	title: "features/Auth/LoginByCredentials",
	component: LoginForm,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [ThemeDecorator(Theme.LIGHT)],
	argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const PrimaryDark: Story = createHiddenDarkStory(Primary);
