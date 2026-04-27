import { memo } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Container.module.scss";

interface ContainerProps {
	className?: string;
	children?: React.ReactNode;
	type?: "normal" | "max";
}

export const Container = memo((props: ContainerProps) => {
	const { className, children, type = "normal" } = props;
	const containerClassName = classNames(cls.container, { [cls.max]: type === "max" }, [className]);

	return <div className={containerClassName}>{children}</div>;
});
