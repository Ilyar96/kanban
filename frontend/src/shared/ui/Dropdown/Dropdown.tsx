import { memo, type ComponentProps, type ReactNode } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { classNames } from "@/shared/lib/classNames/classNames";
import { Button } from "../Button/Button";
import cls from "./Dropdown.module.scss";

type MenuItemsProps = ComponentProps<typeof MenuItems>;
export type AnchorProps = MenuItemsProps["anchor"];

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
	anchorTo?: Extract<AnchorProps, { to?: unknown }>["to"];
	offset?: number;
}

export const Dropdown = memo((props: DropdownProps) => {
	const { className, items, trigger, anchorTo = "bottom", offset = 8 } = props;
	return (
		<Menu
			as="div"
			className={classNames(cls.dropdown, {}, [className])}
		>
			<MenuButton as="div">{trigger}</MenuButton>
			<MenuItems
				anchor={{
					to: anchorTo,
					gap: offset, // отступ в пикселях
				}}
				className={cls.menu}
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
								onClick={item.onClick}
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
