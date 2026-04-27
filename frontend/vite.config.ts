import { defineConfig, loadEnv } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import checker from "vite-plugin-checker";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const isDev = mode === "development";

	return {
		plugins: [
			react(),
			checker({
				typescript: {
					tsconfigPath: "./tsconfig.app.json",
				},
			}),
			!isDev &&
				ViteImageOptimizer({
					includePublic: true,
					logStats: true,
					cache: true,
					cacheLocation: "./.image-cache",
					svg: {
						multipass: true,
						plugins: [
							{
								name: "preset-default",
								params: {
									overrides: {
										cleanupIds: false,
									},
								},
							},
							"removeDimensions",
							"sortAttrs",
						],
					},
					png: {
						quality: 80,
					},
					jpeg: {
						quality: 80,
					},
					jpg: {
						quality: 80,
					},
					webp: {
						quality: 80,
					},
					avif: {
						quality: 50,
					},
					...(env.VITE_IMAGE_OPTIMIZER_OPTIONS && JSON.parse(env.VITE_IMAGE_OPTIMIZER_OPTIONS)),
				}),
		],
		css: {
			devSourcemap: true,
		},
		build: {
			sourcemap: true,
		},
		resolve: {
			alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
		},
		define: {
			__IS_DEV__: JSON.stringify(isDev),
			__API__: JSON.stringify(env.VITE_API_URL ?? "http://localhost:4000"),
			__PROJECT__: JSON.stringify("frontend"),
		},
	};
});
