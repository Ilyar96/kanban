import type { Meta, StoryObj } from "@storybook/react";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { Theme } from "@/shared/config/storybook/ThemeDecorator/theme";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
	title: "shared/Modal",
	component: Modal,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Light: Story = {
	args: {
		children:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam error voluptate, eos ipsam explicabo eligendi nulla adipisci assumenda at ipsa a! Consequatur, pariatur fugiat numquam dignissimos ea animi molestias consectetur.",
		isOpen: true,
	},
};

export const Dark: Story = {
	args: {
		children:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam error voluptate, eos ipsam explicabo eligendi nulla adipisci assumenda at ipsa a! Consequatur, pariatur fugiat numquam dignissimos ea animi molestias consectetur.",
		isOpen: true,
	},
	decorators: [ThemeDecorator(Theme.DARK)],
};
