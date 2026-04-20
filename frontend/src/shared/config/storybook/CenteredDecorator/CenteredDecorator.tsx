import type { Decorator } from "@storybook/react";
import { VStack } from "@/shared/ui/Stack";

export const CenteredDecorator: Decorator = (Story) => (
	<VStack
		align="center"
		justify="center"
		style={{ height: "100vh" }}
	>
		{Story()}
	</VStack>
);
