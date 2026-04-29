import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useState } from "react";
import { Field, Checkbox as HCheckbox, Label } from "@headlessui/react";
import cls from "./Checkbox.module.scss";

interface CheckboxProps {
	label?: string;
	className?: string;
	onChange?: (checked: boolean) => void;
	checked?: boolean;
}

export const Checkbox = memo((props: CheckboxProps) => {
	const { className, label, checked, onChange } = props;
	const [innerChecked, setInnerChecked] = useState(false);

	const isControlled = checked !== undefined;
	const currentChecked = isControlled ? checked : innerChecked;

	const handleChange = (nextValue: boolean) => {
		if (!isControlled) {
			setInnerChecked(nextValue);
		}

		onChange?.(nextValue);
	};

	return (
		<Field className={cls.field}>
			<HCheckbox
				className={classNames(cls.checkbox, {}, [className])}
				checked={currentChecked}
				onChange={handleChange}
			>
				<svg className={cls.checkedIcon}>
					<use href="/icons.svg#checked-icon"></use>
				</svg>
			</HCheckbox>
			{label && <Label className={cls.label}>{label}</Label>}
		</Field>
	);
});
