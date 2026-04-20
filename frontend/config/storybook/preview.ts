import type { Preview } from "@storybook/react-vite";
import "../../src/app/styles/index.scss";

const preview = {
	parameters: {
		layout: "centered",
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
} satisfies Preview;

export default preview;
