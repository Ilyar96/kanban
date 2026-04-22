import { useEffect, useMemo, useState, type FC, type ReactNode } from "react";
import { LOCAL_STORAGE_THEME_KEY, Theme, ThemeContext } from "../lib/ThemeContext";

const defaultTheme = (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme) || Theme.LIGHT;
const themeClasses = Object.values(Theme);

interface ThemeProviderProps {
	initialTheme?: Theme;
	children: ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = (props) => {
	const { children, initialTheme } = props;
	const [theme, setTheme] = useState<Theme>(initialTheme || defaultTheme);

	useEffect(() => {
		document.body.classList.remove(...themeClasses);
		document.body.classList.add(theme);
		localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
	}, [theme]);

	const defaultProps = useMemo(
		() => ({
			theme,
			setTheme,
		}),
		[theme],
	);

	return <ThemeContext.Provider value={defaultProps}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
