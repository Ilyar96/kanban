import { memo, type ReactNode, type SyntheticEvent } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { classNames } from "@/shared/lib/classNames/classNames";
import { Button } from "../Button/Button";
import cls from "./Dropdown.module.scss";
import type { AnchorTo } from "@/shared/types/anchor";

export interface DropdownItem {
	content: string;
	href?: string;
	disabled?: boolean;
	className?: string;
	onClick?: () => void;
}

interface DropdownProps {
	className?: string;
	trigger: ReactNode;
	items: DropdownItem[];
	anchorTo?: AnchorTo;
	gap?: number;
}

export const Dropdown = memo((props: DropdownProps) => {
	const { className, items, trigger, anchorTo = "bottom", gap = 8 } = props;

	const stopPropagation = (event: SyntheticEvent) => {
		event.stopPropagation();
	};

	return (
		<Menu
			as="div"
			className={classNames(cls.dropdown, {}, [className])}
		>
			<MenuButton
				as="div"
				onClick={stopPropagation}
				onKeyDown={stopPropagation}
			>
				{trigger}
			</MenuButton>
			<MenuItems
				anchor={{
					to: anchorTo,
					gap,
				}}
				className={cls.menu}
				onClick={stopPropagation}
				onKeyDown={stopPropagation}
			>
				{items.map((item, index) => (
					<MenuItem
						key={index}
						disabled={item.disabled}
					>
						{({ active }) => (
							<Button
								className={classNames(cls.item, { [cls.itemActive]: active }, [item.className])}
								theme="clear"
								onClick={(event) => {
									event.stopPropagation();
									item.onClick?.();
								}}
							>
								{item.content}
							</Button>
						)}
					</MenuItem>
				))}
			</MenuItems>
		</Menu>
	);
});
