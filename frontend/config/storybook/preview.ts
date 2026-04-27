import type { Preview } from "@storybook/react-vite";
import type { Decorator } from "@storybook/react";
import { Suspense, createElement } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createReduxStore } from "../../src/app/providers/StoreProvider/config/store";
import "../../src/app/styles/index.scss";

const StoreDecorator: Decorator = (Story) => {
	const store = createReduxStore();

	return createElement(Provider, { store, children: createElement(Story) });
};

const RouterDecorator: Decorator = (Story) =>
	createElement(BrowserRouter, null, createElement(Story));

const SuspenseDecorator: Decorator = (Story) => createElement(Suspense, null, createElement(Story));

const preview = {
	decorators: [StoreDecorator, RouterDecorator, SuspenseDecorator],
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
