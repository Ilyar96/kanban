import { classNames } from "@/shared/lib/classNames/classNames";
import {
	Field,
	Listbox as HListbox,
	Label,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/react";
import { memo, useMemo, type ReactNode } from "react";
import type { ListBoxAnchorTo } from "@/shared/types/anchor";
import cls from "./ListBox.module.scss";
import { SpriteIcon } from "../SpriteIcon/SpriteIcon";

export interface ListBoxItem {
	value: string;
	content?: ReactNode;
	disabled?: boolean;
	className?: string;
}

interface ListBoxProps {
	className?: string;
	value?: string;
	defaultValue?: string;
	label?: string;
	onChange?: (value: string) => void;
	items?: ListBoxItem[];
	anchorTo?: ListBoxAnchorTo;
	gap?: number;
}

export const ListBox = memo((props: ListBoxProps) => {
	const {
		className,
		value,
		defaultValue,
		label,
		onChange,
		items,
		anchorTo = "bottom",
		gap = 8,
	} = props;

	const selectedItem = useMemo(() => {
		if (!items || !value) {
			return undefined;
		}

		return items.find((item) => item.value === value);
	}, [items, value]);

	const triggerContent = selectedItem?.content ?? defaultValue ?? "Выберите значение";

	return (
		<div className={classNames(cls.listBox, {}, [className])}>
			<Field>
				{label && <Label className={cls.label}>{label}</Label>}
				<HListbox
					value={value}
					onChange={onChange}
				>
					<ListboxButton className={cls.trigger}>
						<div className={cls.triggerText}>{triggerContent}</div>
						<SpriteIcon
							className={cls.arrowIcon}
							spriteId="chevron-down-icon"
						/>
					</ListboxButton>
					<ListboxOptions
						anchor={{
							to: anchorTo,
							gap: gap,
						}}
						transition
						className={cls.options}
					>
						{items?.map(({ value, className = "", disabled, content }) => (
							<ListboxOption
								key={value}
								value={value}
								content=""
								disabled={disabled}
								className={({ active, selected }) =>
									classNames(
										cls.option,
										{
											[cls.optionActive]: active,
											[cls.optionSelected]: selected,
											[cls.optionDisabled]: !!disabled,
										},
										[className],
									)
								}
							>
								<div className={cls.content}>{content}</div>
							</ListboxOption>
						))}
					</ListboxOptions>
				</HListbox>
			</Field>
		</div>
	);
});
