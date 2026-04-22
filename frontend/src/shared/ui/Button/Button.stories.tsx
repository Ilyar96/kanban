import type { Meta, StoryObj } from "@storybook/react";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { Theme } from "@/app/providers/ThemeProvider";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
	title: "shared/Button",
	component: Button,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		theme: {
			control: "select",
			options: [
				"outline",
				"outline_red",
				"clear",
				"clearInverted",
				"background",
				"backgroundInverted",
			],
		},
		size: {
			control: "select",
			options: ["m", "l", "xl"],
		},
	},
	decorators: [ThemeDecorator(Theme.DARK)],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
	args: {
		children: "Text",
	},
};

export const Clear: Story = {
	args: {
		children: "Text",
		theme: "clear",
	},
};

export const Inverted: Story = {
	args: {
		children: "Text",
		theme: "clearInverted",
	},
};

export const Outline: Story = {
	args: {
		children: "Text",
		theme: "outline",
	},
};

export const SizeS: Story = {
	args: {
		children: "Text",
		theme: "outline",
		size: "s",
	},
};

export const SizeM: Story = {
	args: {
		children: "Text",
		theme: "outline",
		size: "m",
	},
};

export const SizeL: Story = {
	args: {
		children: "Text",
		theme: "outline",
		size: "l",
	},
};

export const SizeXL: Story = {
	args: {
		children: "Text",
		theme: "outline",
		size: "xl",
	},
};

export const BackgroundTheme: Story = {
	args: {
		children: "Text",
		theme: "background",
	},
};

export const BackgroundInvertedTheme: Story = {
	args: {
		children: "Text",
		theme: "backgroundInverted",
	},
};

export const SquareSizeM: Story = {
	args: {
		children: ">",
		theme: "backgroundInverted",
		square: true,
		size: "m",
	},
};

export const SquareSizeL: Story = {
	args: {
		children: ">",
		theme: "backgroundInverted",
		square: true,
		size: "xl",
	},
};

export const Disabled: Story = {
	args: {
		children: "Text",
		theme: "outline",
		disabled: true,
	},
};
