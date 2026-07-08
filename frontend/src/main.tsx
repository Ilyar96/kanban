import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/app/providers/ErrorBoundary";
import { StoreProvider } from "@/app/providers/StoreProvider";
import { Theme, ThemeProvider } from "@/app/providers/ThemeProvider";
import App from "@/app/App.tsx";
import "@/app/styles/index.scss";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<HelmetProvider>
			<StoreProvider>
				<BrowserRouter>
					<ErrorBoundary>
						<ThemeProvider initialTheme={Theme.DARK}>
							<App />
						</ThemeProvider>
					</ErrorBoundary>
				</BrowserRouter>
			</StoreProvider>
		</HelmetProvider>
	</StrictMode>,
);
