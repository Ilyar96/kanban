import {
	type ComponentPropsWithoutRef,
	type CSSProperties,
	type ElementType,
	memo,
	type ReactNode,
} from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Grid.module.scss";

export type GridGap = "xs" | "s" | "m" | "l" | "xl" | "xxl";
export type GridAlign = "start" | "center" | "end" | "stretch";

const alignClasses: Record<GridAlign, string> = {
	start: cls.alignStart,
	center: cls.alignCenter,
	end: cls.alignEnd,
	stretch: cls.alignStretch,
};

interface GridOwnProps {
	className?: string;
	children?: ReactNode;
	gap?: GridGap;
	align?: GridAlign;
	max?: boolean;
	columns?: number;
	minColumnWidth?: string;
	autoFit?: boolean;
}

export type GridProps<C extends ElementType = "div"> = GridOwnProps & {
	as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof GridOwnProps | "as">;

const GridComponent = <C extends ElementType = "div">(props: GridProps<C>) => {
	const {
		className,
		children,
		gap = "l",
		align = "stretch",
		max = false,
		columns,
		minColumnWidth = "280px",
		autoFit = false,
		as: Component = "div",
		style,
		...otherProps
	} = props;

	const gridStyles: CSSProperties = {
		gridTemplateColumns: autoFit
			? `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`
			: columns
				? `repeat(${columns}, minmax(0, 1fr))`
				: undefined,
	};

	const mods = {
		[cls.max]: max,
	};

	return (
		<Component
			className={classNames(cls.Grid, mods, [className, cls[gap], alignClasses[align]])}
			style={{ ...gridStyles, ...style }}
			{...otherProps}
		>
			{children}
		</Component>
	);
};

export const Grid = memo(GridComponent) as typeof GridComponent;
