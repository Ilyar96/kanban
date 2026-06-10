import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./PageLoader.module.scss";
import { Loader } from "../Loader/Loader";
import { VStack } from "../Stack";

interface PageLoaderProps {
	className?: string;
}

export const PageLoader = memo(({ className }: PageLoaderProps) => {
	return (
		<VStack
			className={classNames(cls.pageLoader, {}, [className])}
			align="center"
			justify="center"
		>
			<Loader />
		</VStack>
	);
});
