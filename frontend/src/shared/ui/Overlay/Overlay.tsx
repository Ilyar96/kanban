import { memo } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Overlay.module.scss";

interface OverlayProps {
	className?: string;
	onClick?: () => void;
	isActive?: boolean;
}

export const Overlay = memo((props: OverlayProps) => {
	const { className, onClick, isActive } = props;
	return (
		<div
			className={classNames(cls.overlay, { [cls.active]: isActive }, [className])}
			onClick={onClick}
		/>
	);
});
