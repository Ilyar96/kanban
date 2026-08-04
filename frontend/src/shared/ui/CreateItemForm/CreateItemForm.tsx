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
	title?: string;
	description?: string;
	onTitleChange?: (value: string) => void;
	onDescriptionChange?: (value: string) => void;
	titlePlaceholder?: string;
	descriptionPlaceholder?: string;
	btnText?: string;
	cancelBtnText?: string;
	onSubmit?: () => void;
	onCancel?: () => void;
	titleFieldType?: "input" | "textarea";
	isCard?: boolean;
	autoFocus?: boolean;
	isBtnDisabled?: boolean;
}

export const CreateItemForm = memo((props: CreateItemFormProps) => {
	const {
		className,
		btnText = "Добавить",
		cancelBtnText,
		titleFieldType = "input",
		title,
		description,
		onCancel,
		onTitleChange,
		onDescriptionChange,
		onSubmit,
		isCard,
		titlePlaceholder,
		descriptionPlaceholder,
		autoFocus,
		isBtnDisabled,
	} = props;

	const Wrapper = isCard ? Card : "div";

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
				gap="s"
				className={classNames(cls.createItemForm, {}, [className])}
				onSubmit={submitHandler}
			>
				<TextField
					value={title}
					placeholder={titlePlaceholder}
					as={titleFieldType}
					autoFocus={autoFocus}
					onChange={onTitleChange}
				/>
				{description !== undefined && (
					<TextField
						value={description}
						placeholder={descriptionPlaceholder}
						as="textarea"
						onChange={onDescriptionChange}
					/>
				)}
				<HStack
					align="center"
					gap="l"
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
						{cancelBtnText ? (
							cancelBtnText
						) : (
							<>
								<SpriteIcon
									className={cls.closeIcon}
									spriteId="icon-close"
								/>
								<span className="visually-hidden">Отмена</span>
							</>
						)}
					</Button>
				</HStack>
			</VStack>
		</Wrapper>
	);
});
