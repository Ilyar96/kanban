import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";
import { SpriteIcon } from "@/shared/ui/SpriteIcon/SpriteIcon";
import { Button } from "@/shared/ui/Button/Button";
import cls from "./FavoriteButton.module.scss";

interface FavoriteButtonProps {
	className?: string;
	isFavorite?: boolean;
	onToggle?: () => void;
	disabled?: boolean;
}

export const FavoriteButton = memo((props: FavoriteButtonProps) => {
	const { className, isFavorite, onToggle, disabled } = props;
	return (
		<Button
			className={classNames(cls.favoriteButton, {}, [className])}
			onClick={onToggle}
			disabled={disabled}
		>
			<SpriteIcon
				className={cls.icon}
				spriteId={isFavorite ? "icon-star-filled" : "icon-star"}
			/>
			<span className="visually-hidden">{isFavorite ? "В избранном" : "Не в избранном"}</span>
		</Button>
	);
});
