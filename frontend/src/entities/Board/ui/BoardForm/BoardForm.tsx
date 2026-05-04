import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/shared/ui/Button/Button";
import { Popover } from "@/shared/ui/Popover/Popover";
import { TextField } from "@/shared/ui/TextField/TextField";
import { Text } from "@/shared/ui/Text/Text";
import { Checkbox } from "@/shared/ui/Checkbox/Checkbox";
import { ListBox, type ListBoxItem } from "@/shared/ui/ListBox/ListBox";
import { Loader } from "@/shared/ui/Loader/Loader";
import { BackgroundList } from "@/shared/ui/BackgroundList/BackgroundList";
import { Controller, useForm } from "react-hook-form";
import { gradients } from "@/shared/const/gradients";
import cls from "./BoardForm.module.scss";
import type { BoardVisibility } from "@/shared/types/board";
import { BackgroundPreview } from "../BackgroundPreview/BackgroundPreview";

interface BoardFormProps {
	className?: string;
	triggerClassName?: string;
	trigger?: ReactNode;
	renderInPopover?: boolean;
	initialValues?: BoardFormInitialValues;
	onSubmit: (values: BoardFormSubmitValues) => Promise<void> | void;
	onSuccess?: () => void;
	isLoading?: boolean;
	errorMessage?: string;
	submitText?: string;
	showFavorite?: boolean;
}

export interface BoardFormInitialValues {
	title?: string;
	description?: string;
	visibility?: BoardVisibility;
	backgroundColor?: string;
	isFavorite?: boolean;
}

export interface BoardFormSubmitValues {
	title: string;
	description?: string;
	visibility: BoardVisibility;
	backgroundColor?: string;
	isFavorite?: boolean;
}

const boardPrivacyItems: ListBoxItem[] = [
	{ value: "PRIVATE", content: "Приватная" },
	{ value: "WORKSPACE", content: "Видимая для участников" },
	{ value: "PUBLIC", content: "Публичная" },
];

interface BoardFormValues {
	title: string;
}

export const BoardForm = memo((props: BoardFormProps) => {
	const {
		className,
		triggerClassName,
		initialValues,
		trigger,
		renderInPopover = true,
		onSubmit,
		onSuccess,
		submitText = "Сохранить",
		isLoading,
		errorMessage,
		showFavorite = true,
	} = props;

	const initialTitle = initialValues?.title ?? "";
	const initialDescription = initialValues?.description ?? "";
	const initialVisibility = initialValues?.visibility ?? "PRIVATE";
	const initialBackgroundColor = initialValues?.backgroundColor ?? gradients[0];
	const initialIsFavorite = initialValues?.isFavorite ?? false;

	const [description, setDescription] = useState(initialDescription);
	const [visibility, setVisibility] = useState<BoardVisibility>(initialVisibility);
	const [backgroundColor, setBackgroundColor] = useState(initialBackgroundColor);
	const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<BoardFormValues>({
		defaultValues: {
			title: initialTitle,
		},
	});

	const titleValue = watch("title", "");

	const submitHandler = async (values: BoardFormValues, close?: () => void) => {
		const normalizedTitle = values.title.trim();
		if (!normalizedTitle) {
			return;
		}

		try {
			await onSubmit({
				title: normalizedTitle,
				description: description.trim() || undefined,
				visibility,
				backgroundColor: backgroundColor.trim() || undefined,
				isFavorite,
			});

			reset({ title: initialTitle });
			setDescription(initialDescription);
			setVisibility(initialVisibility);
			setBackgroundColor(initialBackgroundColor);
			setIsFavorite(initialIsFavorite);
			if (close) {
				close();
			}
			if (onSuccess) {
				onSuccess();
			}
		} catch {
			console.error("Error submitting board form");
		}
	};

	const onBackgroundChange = useCallback((bg: string) => {
		setBackgroundColor(bg);
	}, []);

	const onBoardPrivacyChange = useCallback((value: string) => {
		setVisibility(value as BoardVisibility);
	}, []);

	useEffect(() => {
		reset({ title: initialTitle });
		setDescription(initialDescription);
		setVisibility(initialVisibility);
		setBackgroundColor(initialBackgroundColor);
		setIsFavorite(initialIsFavorite);
	}, [
		initialTitle,
		initialDescription,
		initialVisibility,
		initialBackgroundColor,
		initialIsFavorite,
		reset,
	]);

	const resolvedTrigger = useMemo(
		() =>
			trigger ?? (
				<Button
					className={triggerClassName}
					theme="background"
					size="l"
				>
					Открыть форму доски
				</Button>
			),
		[trigger, triggerClassName],
	);

	const form = (
		<form
			onSubmit={handleSubmit((values) => submitHandler(values))}
			className={cls.form}
		>
			<BackgroundPreview background={backgroundColor} />

			<BackgroundList
				className={cls.backgroundList}
				backgroundList={gradients}
				onChange={onBackgroundChange}
			/>

			<Controller
				name="title"
				control={control}
				rules={{
					required: "Введите название доски",
					validate: (value) => value.trim().length > 0 || "Название доски не может быть пустым",
				}}
				render={({ field }) => (
					<TextField
						label="Название доски"
						value={field.value}
						onChange={field.onChange}
						onBlur={field.onBlur}
						name={field.name}
						placeholder="Например, Маркетинг"
						error={errors.title?.message}
					/>
				)}
			/>

			<TextField
				as="textarea"
				label="Описание"
				value={description}
				onChange={setDescription}
				placeholder="Коротко о цели этой доски"
				rows={3}
			/>

			<ListBox
				items={boardPrivacyItems}
				value={visibility}
				onChange={onBoardPrivacyChange}
				label="Видимость"
			/>

			{showFavorite && (
				<Checkbox
					className={cls.checkbox}
					label="Добавить в избранное"
					checked={isFavorite}
					onChange={setIsFavorite}
				/>
			)}

			{errorMessage && (
				<Text
					theme="error"
					text={errorMessage}
					size="s"
				/>
			)}

			<Button
				className={cls.submitBtn}
				type="submit"
				theme="backgroundInverted"
				disabled={isLoading || !titleValue.trim()}
			>
				{isLoading ? <Loader size="s" /> : submitText}
			</Button>
		</form>
	);

	return (
		<div className={classNames(cls.boardForm, {}, [className])}>
			{renderInPopover ? (
				<Popover
					className={cls.popover}
					trigger={resolvedTrigger}
					anchorTo="right"
				>
					{({ close }) => (
						<form
							onSubmit={handleSubmit((values) => submitHandler(values, close))}
							className={cls.form}
						>
							{form.props.children}
						</form>
					)}
				</Popover>
			) : (
				form
			)}
		</div>
	);
});
