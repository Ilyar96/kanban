import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { createHiddenDarkStory } from "@/shared/config/storybook/helper/hiddenDarkStory";
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

export const PrimaryDark: Story = createHiddenDarkStory(Primary);

export const Clear: Story = {
	args: {
		children: "Text",
		theme: "clear",
	},
};

export const ClearDark: Story = createHiddenDarkStory(Clear);

export const Inverted: Story = {
	args: {
		children: "Text",
		theme: "clearInverted",
	},
};

export const InvertedDark: Story = createHiddenDarkStory(Inverted);

export const Outline: Story = {
	args: {
		children: "Text",
		theme: "outline",
	},
};

export const OutlineDark: Story = createHiddenDarkStory(Outline);

export const SizeS: Story = {
	args: {
		children: "Text",
		theme: "outline",
		size: "s",
	},
};

export const SizeSDark: Story = createHiddenDarkStory(SizeS);

export const SizeM: Story = {
	args: {
		children: "Text",
		theme: "outline",
		size: "m",
	},
};

export const SizeMDark: Story = createHiddenDarkStory(SizeM);

export const SizeL: Story = {
	args: {
		children: "Text",
		theme: "outline",
		size: "l",
	},
};

export const SizeLDark: Story = createHiddenDarkStory(SizeL);

export const SizeXL: Story = {
	args: {
		children: "Text",
		theme: "outline",
		size: "xl",
	},
};

export const SizeXLDark: Story = createHiddenDarkStory(SizeXL);

export const BackgroundTheme: Story = {
	args: {
		children: "Text",
		theme: "background",
	},
};

export const BackgroundThemeDark: Story = createHiddenDarkStory(BackgroundTheme);

export const BackgroundInvertedTheme: Story = {
	args: {
		children: "Text",
		theme: "backgroundInverted",
	},
};

export const BackgroundInvertedThemeDark: Story = createHiddenDarkStory(BackgroundInvertedTheme);

export const SquareSizeM: Story = {
	args: {
		children: ">",
		theme: "backgroundInverted",
		square: true,
		size: "m",
	},
};

export const SquareSizeMDark: Story = createHiddenDarkStory(SquareSizeM);

export const SquareSizeL: Story = {
	args: {
		children: ">",
		theme: "backgroundInverted",
		square: true,
		size: "xl",
	},
};

export const SquareSizeLDark: Story = createHiddenDarkStory(SquareSizeL);

export const Disabled: Story = {
	args: {
		children: "Text",
		theme: "outline",
		disabled: true,
	},
};

export const DisabledDark: Story = createHiddenDarkStory(Disabled);
