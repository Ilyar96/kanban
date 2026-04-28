import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./Avatar.module.scss";
import { VStack } from "../Stack";

interface AvatarProps {
	className?: string;
	src?: string;
	username?: string;
	size?: "s" | "m" | "l";
}

export const Avatar = memo((props: AvatarProps) => {
	const { className, src, username, size = "m" } = props;
	return (
		<VStack
			as="span"
			className={classNames(cls.avatar, {}, [className, cls[size]])}
			align="center"
			justify="center"
		>
			{src ? (
				<img
					src={src}
					alt={username ? username : "Avatar"}
				/>
			) : (
				<span>{username ? username[0].toUpperCase() : "A"}</span>
			)}
		</VStack>
	);
});
