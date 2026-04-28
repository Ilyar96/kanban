import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown, type AnchorProps } from "./Dropdown";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { Button } from "../Button/Button";
import { CenteredDecorator } from "@/shared/config/storybook/CenteredDecorator/CenteredDecorator";

const anchors: AnchorProps[] = [
	"bottom end",
	"bottom start",
	"bottom",
	"left end",
	"left start",
	"left",
	"right end",
	"right start",
	"right",
	"top end",
	"top start",
	"top",
];

const meta: Meta<typeof Dropdown> = {
	title: "shared/Dropdown",
	component: Dropdown,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		anchorTo: { control: "select", options: anchors },
	},
	decorators: [CenteredDecorator, ThemeDecorator(Theme.LIGHT)],
	args: {
		trigger: <Button theme="background">Open Dropdown</Button>,
		items: [
			{ content: "Item 1", onClick: () => alert("Clicked Item 1") },
			{ content: "Item 2", onClick: () => alert("Clicked Item 2") },
			{ content: "Item 3", onClick: () => alert("Clicked Item 3"), disabled: true },
		],
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const PrimaryDark: Story = {
	args: Primary.args,
	decorators: [CenteredDecorator, ThemeDecorator(Theme.DARK)],
};
