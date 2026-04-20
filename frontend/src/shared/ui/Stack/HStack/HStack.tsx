import type { ElementType, JSX } from "react";
import { Flex, type FlexProps } from "../Flex/Flex";

type HStackProps<C extends ElementType = "div"> = Omit<FlexProps<C>, "direction">;

type HStackComponentType = {
	(props: HStackProps<"div">): JSX.Element;
	<C extends ElementType>(props: HStackProps<C> & { as: C }): JSX.Element;
};

const HStackComponent = <C extends ElementType = "div">(props: HStackProps<C>) => {
	const flexProps = { ...props, direction: "row" } as FlexProps<C>;

	return <Flex<C> {...flexProps} />;
};

export const HStack = HStackComponent as HStackComponentType;
