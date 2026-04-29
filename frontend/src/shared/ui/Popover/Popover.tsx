import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, type ComponentProps, type ReactNode } from "react";
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
}

export const Popover = memo((props: PopoverProps) => {
	const { className, trigger, children, anchorTo = "bottom", offset = 8 } = props;
	return (
		<HPopover className={classNames(cls.popover, {}, [className])}>
			{({ close }) => (
				<>
					<PopoverButton
						className={cls.trigger}
						as="div"
					>
						{trigger}
					</PopoverButton>
					<PopoverPanel
						anchor={{
							to: anchorTo,
							gap: offset, // отступ в пикселях
						}}
						className={cls.panel}
					>
						{typeof children === "function" ? children({ close }) : children}
					</PopoverPanel>
				</>
			)}
		</HPopover>
	);
});
