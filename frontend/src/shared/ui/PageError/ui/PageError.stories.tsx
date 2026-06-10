import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageError } from "./PageError";
import { Theme } from "@/app/providers/ThemeProvider";
import { ThemeDecorator } from "@/shared/config/storybook/ThemeDecorator/ThemeDecorator";

const meta = {
	title: "shared/PageError",
	component: PageError,
	decorators: [ThemeDecorator(Theme.LIGHT)],
} satisfies Meta<typeof PageError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const PrimaryDark: Story = {
	args: Primary.args,
	decorators: [ThemeDecorator(Theme.DARK)],
};
