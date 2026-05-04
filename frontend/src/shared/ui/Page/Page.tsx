import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, type ReactNode } from "react";
import cls from "./Page.module.scss";

interface PageProps {
	className?: string;
	children?: ReactNode;
}

export const Page = memo(({ className, children }: PageProps) => {
	return <div className={classNames(cls.page, {}, [className])}>{children}</div>;
});
