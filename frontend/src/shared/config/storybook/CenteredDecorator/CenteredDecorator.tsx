import { VStack } from "@/shared/ui/Stack";
import type { Decorator } from "@storybook/react-vite";

export const CenteredDecorator: Decorator = (Story) => (
	<VStack
		align="center"
		justify="center"
		style={{ height: "100vh" }}
	>
		<Story />
	</VStack>
);
