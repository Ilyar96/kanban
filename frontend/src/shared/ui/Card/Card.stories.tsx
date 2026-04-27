import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { Text } from "../Text/Text";
import { createHiddenDarkStory } from "@/shared/config/storybook/helper/hiddenDarkStory";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const meta: Meta<typeof Card> = {
	title: "shared/Card",
	component: Card,
	parameters: {
		layout: "fullscreen",
	},
	args: {
		children: (
			<Text
				title="Title"
				text="Text"
			/>
		),
	},
	decorators: [ThemeDecorator(Theme.LIGHT)],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const PrimaryDark: Story = createHiddenDarkStory(Primary);

export const Outlined: Story = {
	args: {
		theme: "outlined",
	},
};

export const OutlinedDark: Story = createHiddenDarkStory(Outlined);
