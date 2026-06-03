import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, type ComponentProps, type MouseEvent, type ReactNode } from "react";
import cls from "./Popover.module.scss";
import { Popover as HPopover, PopoverButton, PopoverPanel } from "@headlessui/react";

type PopoverPanelProps = ComponentProps<typeof PopoverPanel>;
export type AnchorProps = PopoverPanelProps["anchor"];

interface PopoverProps {
	className?: string;
	trigger: ReactNode;
	children: ReactNode | ((props: { close: () => void }) => ReactNode);
	anchorTo?: Extract<AnchorProps, { to?: unknown }>["to"];
	offset?: number;
	openOnHover?: boolean;
	size?: "s" | "m" | "l";
}

export const Popover = memo((props: PopoverProps) => {
	const {
		className,
		trigger,
		children,
		anchorTo = "bottom",
		size = "m",
		offset = 8,
		openOnHover = false,
	} = props;

	return (
		<HPopover className={classNames(cls.popover, {}, [className])}>
			{({ open, close }) => {
				const handlePopoverMouseLeave = () => {
					if (!openOnHover) {
						return;
					}

					close();
				};

				const handleTriggerMouseEnter = (event: MouseEvent<HTMLElement>) => {
					if (!openOnHover || open) {
						return;
					}

					(event.currentTarget as HTMLElement).click();
				};

				return (
					<div onMouseLeave={handlePopoverMouseLeave}>
						<PopoverButton
							as="span"
							onMouseEnter={handleTriggerMouseEnter}
						>
							{trigger}
						</PopoverButton>
						<PopoverPanel
							anchor={{
								to: anchorTo,
								gap: offset,
							}}
							className={classNames(cls.panel, {}, [cls[size]])}
						>
							{typeof children === "function" ? children({ close }) : children}
						</PopoverPanel>
					</div>
				);
			}}
		</HPopover>
	);
});
