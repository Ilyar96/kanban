import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const scriptsDir = path.dirname(currentFile);
const projectRoot = path.resolve(scriptsDir, "..");
const sourceFile = path.join(projectRoot, "public", "icons.svg");
const distDir = path.join(projectRoot, "dist");
const targetFile = path.join(distDir, "icons.svg");

if (!existsSync(sourceFile)) {
	console.error("[postbuild] icons.svg not found in public directory");
	process.exit(1);
}

if (!existsSync(distDir)) {
	mkdirSync(distDir, { recursive: true });
}

copyFileSync(sourceFile, targetFile);
console.log("[postbuild] icons.svg copied to dist/icons.svg");
