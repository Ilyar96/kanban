import type { ElementType, JSX } from "react";
import { Flex, type FlexProps } from "../Flex/Flex";

type VStackProps<C extends ElementType = "div"> = Omit<FlexProps<C>, "direction">;

type VStackComponentType = {
	(props: VStackProps<"div">): JSX.Element;
	<C extends ElementType>(props: VStackProps<C> & { as: C }): JSX.Element;
};

const VStackComponent = <C extends ElementType = "div">(props: VStackProps<C>) => {
	const flexProps = { ...props, direction: "column" } as FlexProps<C>;

	return <Flex<C> {...flexProps} />;
};

export const VStack = VStackComponent as VStackComponentType;
