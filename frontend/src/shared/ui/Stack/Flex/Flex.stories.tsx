import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "./Flex";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const meta: Meta<typeof Flex> = {
	title: "shared/Flex",
	component: Flex,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		gap: {
			control: { type: "radio" },
			options: ["4", "8", "12", "16", "32"],
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
	decorators: [ThemeDecorator(Theme.LIGHT)],
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

export const RowDark: Story = {
	args: Row.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const RowGap16: Story = {
	args: {
		children,
		gap: "16",
	},
};

export const RowGap16Dark: Story = {
	args: RowGap16.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const RowCenter: Story = {
	args: {
		justify: "center",
		children,
	},
};

export const RowCenterDark: Story = {
	args: RowCenter.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const RowEnd: Story = {
	args: {
		justify: "end",
		children,
	},
};

export const RowEndDark: Story = {
	args: RowEnd.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const Column: Story = {
	args: {
		direction: "column",
		children,
	},
};

export const ColumnDark: Story = {
	args: Column.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const ColumnGap16: Story = {
	args: {
		direction: "column",
		gap: "16",
		children,
	},
};

export const ColumnGap16Dark: Story = {
	args: ColumnGap16.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const ColumnCenter: Story = {
	args: {
		direction: "column",
		align: "center",
		children,
	},
};

export const ColumnCenterDark: Story = {
	args: ColumnCenter.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};

export const ColumnEnd: Story = {
	args: {
		direction: "column",
		align: "end",
		children,
	},
};

export const ColumnEndDark: Story = {
	args: ColumnEnd.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};
