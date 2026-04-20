import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageError } from "./PageError";

const meta = {
	title: "widgets/PageError",
	component: PageError,
	tags: ["autodocs"],
} satisfies Meta<typeof PageError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
