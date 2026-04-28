import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

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
	decorators: [ThemeDecorator(Theme.LIGHT)],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
	args: {
		children: "Text",
		theme: "backgroundInverted",
	},
};

export const PrimaryDark: Story = {
	args: Primary.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const Clear: Story = {
	args: {
		children: "Text",
		theme: "clear",
	},
};

export const ClearDark: Story = {
	args: Clear.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const Inverted: Story = {
	args: {
		children: "Text",
		theme: "clearInverted",
	},
};

export const InvertedDark: Story = {
	args: Inverted.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const Outline: Story = {
	args: {
		children: "Text",
		theme: "outline",
	},
};

export const OutlineDark: Story = {
	args: Outline.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const SizeS: Story = {
	args: {
		children: "Text",
		theme: "outline",
		size: "s",
	},
};

export const SizeSDark: Story = {
	args: SizeS.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const SizeM: Story = {
	args: {
		children: "Text",
		theme: "outline",
		size: "m",
	},
};

export const SizeMDark: Story = {
	args: SizeM.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const SizeL: Story = {
	args: {
		children: "Text",
		theme: "outline",
		size: "l",
	},
};

export const SizeLDark: Story = {
	args: SizeL.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const SizeXL: Story = {
	args: {
		children: "Text",
		theme: "outline",
		size: "xl",
	},
};

export const SizeXLDark: Story = {
	args: SizeXL.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const BackgroundTheme: Story = {
	args: {
		children: "Text",
		theme: "background",
	},
};

export const BackgroundThemeDark: Story = {
	args: BackgroundTheme.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const BackgroundInvertedTheme: Story = {
	args: {
		children: "Text",
		theme: "backgroundInverted",
	},
};

export const BackgroundInvertedThemeDark: Story = {
	args: BackgroundInvertedTheme.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const SquareSizeM: Story = {
	args: {
		children: ">",
		theme: "backgroundInverted",
		square: true,
		size: "m",
	},
};

export const SquareSizeMDark: Story = {
	args: SquareSizeM.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const SquareSizeL: Story = {
	args: {
		children: ">",
		theme: "backgroundInverted",
		square: true,
		size: "xl",
	},
};

export const SquareSizeLDark: Story = {
	args: SquareSizeL.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const Disabled: Story = {
	args: {
		children: "Text",
		theme: "outline",
		disabled: true,
	},
};

export const DisabledDark: Story = {
	args: Disabled.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};
