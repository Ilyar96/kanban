import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "./Popover";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { Button } from "../Button/Button";
import { CenteredDecorator } from "@/shared/config/storybook/CenteredDecorator/CenteredDecorator";
import type { AnchorTo } from "@/shared/types/anchor";

const anchors: AnchorTo[] = [
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

const meta: Meta<typeof Popover> = {
	title: "shared/Popover",
	component: Popover,
	parameters: {
		layout: "fullscreen",
	},
	tags: [],
	decorators: [CenteredDecorator, ThemeDecorator(Theme.LIGHT)],
	argTypes: {
		anchorTo: { control: "select", options: anchors },
	},
	args: {
		trigger: <Button theme="background">Open Popover</Button>,
		children: <div>Popover Content</div>,
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const PrimaryDark: Story = {
	decorators: [CenteredDecorator, ThemeDecorator(Theme.DARK)],
};
