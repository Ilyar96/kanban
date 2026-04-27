import type { Decorator } from "@storybook/react";

export const PageFullHeightDecorator: Decorator = (Story) => (
	<div className={"app"}>
		<main className="content-page">
			<Story />
		</main>
	</div>
);
