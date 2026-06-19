import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./SpriteIcon.module.scss";

interface SpriteIconProps {
	className?: string;
	spriteUrl?: string;
	spriteId: string;
}

export const SpriteIcon = memo((props: SpriteIconProps) => {
	const { className, spriteUrl, spriteId } = props;
	const defaultSpriteUrl = `${import.meta.env.BASE_URL}icons.svg`;
	const resolvedSpriteUrl = spriteUrl ?? defaultSpriteUrl;
	const spriteHref = `${resolvedSpriteUrl}#${spriteId}`;

	return (
		<svg
			className={classNames(cls.icon, {}, [className])}
			aria-hidden="true"
			focusable="false"
		>
			<use
				href={spriteHref}
				xlinkHref={spriteHref}
				x="0"
				y="0"
				width="100%"
				height="100%"
			/>
		</svg>
	);
});
