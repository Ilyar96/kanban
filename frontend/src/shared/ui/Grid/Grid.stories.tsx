import type { Meta, StoryObj } from "@storybook/react";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";
import { Card } from "@/shared/ui/Card/Card";
import { Grid } from "./Grid";

const meta: Meta<typeof Grid> = {
	title: "shared/Grid",
	component: Grid,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		gap: {
			control: { type: "radio" },
			options: ["4", "8", "12", "16", "24", "32"],
		},
		align: {
			control: { type: "radio" },
			options: ["start", "center", "end", "stretch"],
		},
	},
	decorators: [ThemeDecorator(Theme.LIGHT)],
};

export default meta;
type Story = StoryObj<typeof Grid>;

const children = (
	<>
		<Card style={{ padding: "16px", minHeight: "120px" }}>Card 1</Card>
		<Card style={{ padding: "16px", minHeight: "120px" }}>Card 2</Card>
		<Card style={{ padding: "16px", minHeight: "120px" }}>Card 3</Card>
		<Card style={{ padding: "16px", minHeight: "120px" }}>Card 4</Card>
	</>
);

export const AutoFit: Story = {
	args: {
		children,
		gap: "16",
		autoFit: true,
		minColumnWidth: "240px",
		style: { padding: "24px" },
	},
};

export const FixedColumns: Story = {
	args: {
		children,
		gap: "16",
		autoFit: false,
		columns: 3,
		style: { padding: "24px" },
	},
};

export const AutoFitDark: Story = {
	args: AutoFit.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};
