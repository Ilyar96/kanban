import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback, type FormEvent } from "react";
import cls from "./CreateItemForm.module.scss";
import { TextField } from "../TextField/TextField";
import { HStack, VStack } from "../Stack";
import { Button } from "../Button/Button";
import { SpriteIcon } from "../SpriteIcon/SpriteIcon";
import { Card } from "../Card/Card";

interface CreateItemFormProps {
	className?: string;
	value?: string;
	placeholder?: string;
	onChange?: (value: string) => void;
	btnText?: string;
	onSubmit?: () => void;
	onCancel?: () => void;
	fieldType?: "input" | "textarea";
	isCard?: boolean;
	autoFocus?: boolean;
	isBtnDisabled?: boolean;
}

export const CreateItemForm = memo((props: CreateItemFormProps) => {
	const {
		className,
		btnText = "Добавить",
		fieldType = "input",
		value,
		onCancel,
		onChange,
		onSubmit,
		isCard,
		placeholder,
		autoFocus,
		isBtnDisabled,
	} = props;

	const Wrapper = isCard ? Card : "form";

	const submitHandler = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			onSubmit?.();
		},
		[onSubmit],
	);

	return (
		<Wrapper>
			<VStack
				as="form"
				gap="8"
				className={classNames(cls.createItemForm, {}, [className])}
				onSubmit={submitHandler}
			>
				<TextField
					value={value}
					placeholder={placeholder}
					as={fieldType}
					autoFocus={autoFocus}
					onChange={onChange}
				/>
				<HStack
					align="center"
					gap="16"
				>
					<Button
						type="submit"
						disabled={isBtnDisabled}
					>
						{btnText}
					</Button>
					<Button
						theme="clear"
						className={cls.cancelBtn}
						onClick={onCancel}
					>
						<SpriteIcon
							className={cls.closeIcon}
							spriteId="icon-close"
						/>
						<span className="visually-hidden">Отмена</span>
					</Button>
				</HStack>
			</VStack>
		</Wrapper>
	);
});
