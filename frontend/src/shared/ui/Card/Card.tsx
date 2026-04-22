import { type ComponentPropsWithoutRef, type ElementType, type ReactNode, memo } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Card.module.scss";

export type CardTheme = "normal" | "outlined";

type CardOwnProps<T extends ElementType> = {
	className?: string;
	children: ReactNode;
	theme?: CardTheme;
	as?: T;
	max?: boolean;
};

export type CardProps<T extends ElementType = "div"> = CardOwnProps<T> &
	Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps<T>>;

const CardComponent = <T extends ElementType = "div">(props: CardProps<T>) => {
	const { className, children, theme = "normal", max, as, ...otherProps } = props;
	const Tag = as ?? "div";

	return (
		<Tag
			className={classNames(cls.card, { [cls.max]: max }, [className, cls[theme]])}
			{...otherProps}
		>
			{children}
		</Tag>
	);
};

export const Card = memo(CardComponent) as typeof CardComponent;
