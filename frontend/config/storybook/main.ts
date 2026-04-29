import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const srcPath = fileURLToPath(new URL("../../src", import.meta.url));

const config: StorybookConfig = {
	stories: ["../../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	staticDirs: ["../../public"],
	addons: [],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	viteFinal: async (config) => {
		config.css ??= {};
		config.css.devSourcemap = true;

		config.build ??= {};
		config.build.sourcemap = true;

		config.resolve ??= {};
		const alias = config.resolve.alias;
		const appAlias = { find: "@", replacement: srcPath };
		config.define = {
			...(config.define ?? {}),
			__IS_DEV__: JSON.stringify(true),
			__API__: JSON.stringify("http://localhost:4000"),
			__PROJECT__: JSON.stringify("storybook"),
		};

		if (Array.isArray(alias)) {
			config.resolve.alias = [...alias, appAlias];
		} else {
			config.resolve.alias = {
				...(alias ?? {}),
				"@": srcPath,
			};
		}

		return config;
	},
};

export default config;
