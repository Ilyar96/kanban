import { type ComponentPropsWithoutRef, type ElementType, memo, type ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Flex.module.scss";

export type FlexJustify = "start" | "center" | "end" | "between" | "around";
export type FlexAlign = "start" | "center" | "end" | "stretch";
export type FlexDirection = "row" | "column";
export type FlexGap = "xs" | "s" | "m" | "l" | "xl" | "xxl";

const justifyClasses: Record<FlexJustify, string> = {
	start: cls.justifyStart,
	center: cls.justifyCenter,
	end: cls.justifyEnd,
	between: cls.justifyBetween,
	around: cls.justifyAround,
};

const alignClasses: Record<FlexAlign, string> = {
	start: cls.alignStart,
	center: cls.alignCenter,
	end: cls.alignEnd,
	stretch: cls.alignStretch,
};

const directionClasses: Record<FlexDirection, string> = {
	row: cls.directionRow,
	column: cls.directionColumn,
};

interface FlexOwnProps {
	className?: string;
	children?: ReactNode;
	justify?: FlexJustify;
	align?: FlexAlign;
	direction?: FlexDirection;
	gap?: FlexGap;
	max?: boolean;
}

export type FlexProps<C extends ElementType = "div"> = FlexOwnProps & {
	as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof FlexOwnProps | "as">;

const FlexComponent = <C extends ElementType = "div">(props: FlexProps<C>) => {
	const {
		className,
		children,
		justify = "start",
		align = "start",
		direction = "row",
		gap,
		as: Component = "div",
		max = false,
		...otherProps
	} = props;

	const addClasses = [
		justifyClasses[justify],
		alignClasses[align],
		directionClasses[direction],
		gap && cls[gap],
	];
	const mods = {
		[cls.max]: max,
	};

	return (
		<Component
			className={classNames(cls.Flex, mods, [className, ...addClasses])}
			{...otherProps}
		>
			{children}
		</Component>
	);
};

export const Flex = memo(FlexComponent) as typeof FlexComponent;
