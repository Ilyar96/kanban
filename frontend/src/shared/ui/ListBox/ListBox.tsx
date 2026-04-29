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

export interface ListBoxItem {
	value: string;
	content?: ReactNode;
	disabled?: boolean;
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
						<svg className={cls.arrowIcon}>
							<use href="/icons.svg#chevron-down-icon"></use>
						</svg>
					</ListboxButton>
					<ListboxOptions
						anchor={{
							to: anchorTo,
							gap: gap,
						}}
						transition
						className={cls.options}
					>
						{items?.map((item) => (
							<ListboxOption
								key={item.value}
								value={item.value}
								disabled={item.disabled}
								className={({ active, selected }) =>
									classNames(cls.option, {
										[cls.optionActive]: active,
										[cls.optionSelected]: selected,
										[cls.optionDisabled]: !!item.disabled,
									})
								}
							>
								<div className={cls.content}>{item.content}</div>
							</ListboxOption>
						))}
					</ListboxOptions>
				</HListbox>
			</Field>
		</div>
	);
});
