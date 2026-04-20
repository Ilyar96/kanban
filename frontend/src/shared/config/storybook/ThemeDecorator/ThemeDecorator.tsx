import type { Decorator } from "@storybook/react";
import { Theme } from "./theme";
import type { Theme as ThemeType } from "./theme";

const THEME_CLASSES = [Theme.LIGHT, Theme.DARK];

export const ThemeDecorator =
	(theme: ThemeType): Decorator =>
	(Story) => {
		if (typeof document !== "undefined") {
			document.body.classList.remove(...THEME_CLASSES);
			if (theme !== Theme.LIGHT) {
				document.body.classList.add(theme);
			}
		}

		const appClassName = theme === Theme.DARK ? "app app_dark_theme" : "app";

		return (
			<div className={appClassName}>
				<Story />
			</div>
		);
	};
