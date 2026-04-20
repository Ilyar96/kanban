import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "./Flex";

const meta: Meta<typeof Flex> = {
	title: "shared/Flex",
	component: Flex,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		gap: {
			control: { type: "radio" },
			options: ["4", "8", "16", "32"],
		},
		justify: {
			control: { type: "radio" },
			options: ["start", "center", "end", "between"],
		},
		align: {
			control: { type: "radio" },
			options: ["start", "center", "end"],
		},
		direction: {
			control: { type: "radio" },
			options: ["row", "column"],
		},
	},
	args: {},
};

const children = (
	<>
		<div>1</div>
		<div>2</div>
		<div>3</div>
	</>
);

export default meta;
type Story = StoryObj<typeof Flex>;

export const Row: Story = {
	args: {
		children,
	},
};

export const RowGap16: Story = {
	args: {
		children,
		gap: "16",
	},
};

export const RowCenter: Story = {
	args: {
		justify: "center",
		children,
	},
};

export const RowEnd: Story = {
	args: {
		justify: "end",
		children,
	},
};

export const Column: Story = {
	args: {
		direction: "column",
		children,
	},
};

export const ColumnGap16: Story = {
	args: {
		direction: "column",
		gap: "16",
		children,
	},
};

export const ColumnCenter: Story = {
	args: {
		direction: "column",
		align: "center",
		children,
	},
};

export const ColumnEnd: Story = {
	args: {
		direction: "column",
		align: "end",
		children,
	},
};
