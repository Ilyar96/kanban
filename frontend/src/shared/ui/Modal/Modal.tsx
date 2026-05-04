import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, type ReactNode } from "react";
import cls from "./Modal.module.scss";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Button } from "../Button/Button";
import { Text } from "../Text/Text";

interface ModalProps {
	className?: string;
	title?: string;
	children?: ReactNode;
	isOpen?: boolean;
	onClose: () => void;
	cancelDisabled?: boolean;
	confirmDisabled?: boolean;
	confirmBtnText?: string;
	cancelBtnText?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
	actionsClassName?: string;
}

export const Modal = memo((props: ModalProps) => {
	const {
		className,
		children,
		isOpen,
		onClose,
		title,
		cancelBtnText = "Отмена",
		confirmBtnText = "Подтвердить",
		onCancel,
		onConfirm,
		confirmDisabled,
		cancelDisabled,
	} = props;

	const isActionButtons = onCancel || onConfirm;

	const onCancelHandler = () => {
		if (onCancel) {
			onCancel();
		}
		onClose();
	};

	return (
		<Dialog
			className={classNames(cls.modal, {}, [className])}
			open={isOpen}
			as="div"
			onClose={onClose}
		>
			<div className={cls.wrapper}>
				<div className={cls.inner}>
					<DialogPanel
						transition
						className={cls.panel}
					>
						{title && (
							<Text
								className={cls.title}
								title={title}
								size="s"
							/>
						)}
						{children && <div className={cls.content}>{children}</div>}
						{isActionButtons && (
							<div className={classNames(cls.actions, {}, [props.actionsClassName])}>
								{onConfirm && (
									<Button
										className={cls.actionBtn}
										onClick={onConfirm}
										disabled={confirmDisabled}
									>
										{confirmBtnText}
									</Button>
								)}
								{onCancel && (
									<Button
										className={cls.cancelBtn}
										onClick={onCancelHandler}
										disabled={cancelDisabled}
									>
										{cancelBtnText}
									</Button>
								)}
							</div>
						)}
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
});
