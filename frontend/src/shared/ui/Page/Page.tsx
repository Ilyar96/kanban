import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, type ReactNode } from "react";
import cls from "./Page.module.scss";
import { VStack } from "../Stack";

interface PageProps {
	className?: string;
	children?: ReactNode;
	centered?: boolean;
}

export const Page = memo((props: PageProps) => {
	const { className, children, centered } = props;
	const pageClassName = classNames(cls.page, {}, [className]);

	return centered ? (
		<VStack
			className={pageClassName}
			align="center"
			justify="center"
		>
			{children}
		</VStack>
	) : (
		<VStack className={pageClassName}>{children}</VStack>
	);
});
