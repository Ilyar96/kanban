export const Theme = {
	LIGHT: "app_light_theme",
	DARK: "app_dark_theme",
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];
