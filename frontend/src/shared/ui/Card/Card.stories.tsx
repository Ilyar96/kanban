import type { Meta, StoryObj } from "@storybook/react";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { Card } from "./Card";
import { Text } from "../Text/Text";

const meta: Meta<typeof Card> = {
	title: "shared/Card",
	component: Card,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [ThemeDecorator(Theme.DARK)],
	args: {
		children: (
			<Text
				title="Title"
				text="Text"
			/>
		),
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Outlined: Story = {
	args: {
		theme: "outlined",
	},
};
