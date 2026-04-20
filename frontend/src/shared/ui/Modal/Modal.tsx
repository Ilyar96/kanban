import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import type { Mods } from "@/shared/lib/classNames/classNames";
import { Portal } from "../Portal/Portal";
import { Overlay } from "../Overlay/Overlay";
import cls from "./Modal.module.scss";

interface ModalProps {
	className?: string;
	children?: ReactNode;
	isOpen?: boolean;
	onClose?: () => void;
	lazy?: boolean;
}

const ANIMATION_DELAY = 300;

export const Modal = (props: ModalProps) => {
	const { className, children, isOpen, onClose, lazy } = props;

	const [isClosing, setIsClosing] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const closeHandler = useCallback(() => {
		setIsClosing(true);
		timerRef.current = setTimeout(() => {
			onClose?.();
			setIsClosing(false);
		}, ANIMATION_DELAY);
	}, [onClose]);

	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") {
				closeHandler();
			}
		},
		[closeHandler],
	);

	useEffect(() => {
		if (isOpen) {
			window.addEventListener("keydown", onKeyDown);
		}

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [isOpen, onKeyDown]);

	const mods: Mods = {
		[cls.opened]: isOpen,
		[cls.isClosing]: isClosing,
	};

	if (lazy && !isOpen) {
		return null;
	}

	return (
		<Portal>
			<div className={classNames(cls.Modal, mods, [className])}>
				<Overlay
					onClick={closeHandler}
					isActive={Boolean(isOpen)}
				/>
				<div className={cls.content}>{children}</div>
			</div>
		</Portal>
	);
};
