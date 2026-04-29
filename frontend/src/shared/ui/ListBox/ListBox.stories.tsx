import type { Meta, StoryObj } from "@storybook/react";
import { ListBox } from "./ListBox";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import type { ListBoxAnchorTo } from "@/shared/types/anchor";
import { CenteredDecorator } from "../../config/storybook/CenteredDecorator/CenteredDecorator";

const anchors: ListBoxAnchorTo[] = ["bottom", "top"];

const meta: Meta<typeof ListBox> = {
	title: "shared/ListBox",
	component: ListBox,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		anchorTo: { control: "select", options: anchors },
	},
	args: {
		label: "Выберите элемент",
		items: [
			{ value: "1", content: "Item 1" },
			{ value: "2", content: "Item 2" },
			{ value: "3", content: "Item 3", disabled: true },
		],
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	decorators: [CenteredDecorator, ThemeDecorator(Theme.LIGHT)],
};

export const PrimaryDark: Story = {
	decorators: [CenteredDecorator, ThemeDecorator(Theme.DARK)],
};
