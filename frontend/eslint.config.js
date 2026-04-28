import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import ilyarPathChecker from 'eslint-plugin-ilyar-path-checker';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	globalIgnores(['node_modules', 'dist', 'storybook-static']),
	{
		files: ['**/*.{ts,tsx}'],
		plugins: {
			'ilyar-path-checker': ilyarPathChecker,
		},
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			'ilyar-path-checker/path-checker': ['error', { alias: '@' }],
			'ilyar-path-checker/public-api-imports': [
				'error',
				{
					alias: '@',
					testFilesPatterns: [
						'**/*.test.{ts,tsx}',
						'**/*.stories.{ts,tsx}',
						'**/StoreDecorator.tsx',
					],
				},
			],
		},
	},
	eslintConfigPrettier,
]);
