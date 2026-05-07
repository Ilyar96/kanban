import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import cls from "./MoreActionsButton.module.scss";
import { SpriteIcon } from "../SpriteIcon/SpriteIcon";
import { Button } from "../Button/Button";

interface MoreActionsButtonProps {
	className?: string;
	type?: "vertical" | "horizontal";
}

export const MoreActionsButton = memo((props: MoreActionsButtonProps) => {
	const { className, type = "vertical" } = props;
	return (
		<Button className={classNames(cls.moreActionsButton, {}, [className])}>
			<SpriteIcon
				className={cls.moreActionsButtonIcon}
				spriteId={type === "vertical" ? "three-dots-vertical" : "three-dots-horizontal"}
			/>
			<span className="visually-hidden">Настройки доски</span>
		</Button>
	);
});
