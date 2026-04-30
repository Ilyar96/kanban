import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback, useMemo, useState } from "react";
import { Button } from "@/shared/ui/Button/Button";
import { Popover } from "@/shared/ui/Popover/Popover";
import { TextField } from "@/shared/ui/TextField/TextField";
import { useCreateBoardMutation } from "../../model/api/createBoardApi";
import { Text } from "@/shared/ui/Text/Text";
import { Checkbox } from "@/shared/ui/Checkbox/Checkbox";
import { ListBox, type ListBoxItem } from "@/shared/ui/ListBox/ListBox";
import type { BoardPrivacy } from "../../model/types";
import { Loader } from "@/shared/ui/Loader/Loader";
import { BackgroundList } from "@/shared/ui/BackgroundList/BackgroundList";
import { Controller, useForm } from "react-hook-form";
import { BackgroundPreview } from "../BackgroundPreview/BackgroundPreview";
import { gradients } from "@/shared/const/gradients";
import cls from "./CreateBoard.module.scss";

interface CreateBoardProps {
	className?: string;
	triggerClassName?: string;
}

const boardPrivacyItems: ListBoxItem[] = [
	{ value: "PRIVATE", content: "Приватная" },
	{ value: "WORKSPACE", content: "Видимая для участников" },
	{ value: "PUBLIC", content: "Публичная" },
];

interface CreateBoardFormValues {
	title: string;
}

export const CreateBoard = memo((props: CreateBoardProps) => {
	const { className, triggerClassName } = props;
	const [description, setDescription] = useState("");
	const [visibility, setVisibility] = useState<BoardPrivacy>("PRIVATE");
	const [backgroundColor, setBackgroundColor] = useState(gradients[0]);
	const [isFavorite, setIsFavorite] = useState(false);
	const [createBoard, { isLoading, error }] = useCreateBoardMutation();

	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<CreateBoardFormValues>({
		defaultValues: {
			title: "",
		},
	});

	const titleValue = watch("title", "");

	const errorMessage = useMemo(() => {
		if (!error || !("data" in error)) return "";
		const payload = error.data as { message?: string };
		return payload?.message ?? "Не удалось создать доску";
	}, [error]);

	const onSubmit = async (values: CreateBoardFormValues, close: () => void) => {
		const normalizedTitle = values.title.trim();
		if (!normalizedTitle) {
			return;
		}

		try {
			await createBoard({
				title: normalizedTitle,
				description: description.trim() || undefined,
				visibility,
				backgroundColor: backgroundColor.trim() || undefined,
				isFavorite,
			}).unwrap();

			reset({ title: "" });
			setDescription("");
			setVisibility("PRIVATE");
			setBackgroundColor("");
			setIsFavorite(false);
			close();

			// TODO add success notification
		} catch {
			// Error text is handled by RTK Query `error` state.
		}
	};

	const onBackgroundChange = useCallback((bg: string) => {
		setBackgroundColor(bg);
	}, []);

	const onBoardPrivacyChange = useCallback((value: string) => {
		if (value === "PRIVATE" || value === "WORKSPACE" || value === "PUBLIC") {
			setVisibility(value as BoardPrivacy);
		}
	}, []);

	const trigger = (
		<Button
			className={triggerClassName}
			theme="background"
			size="l"
		>
			Создать доску
		</Button>
	);
	return (
		<div className={classNames(cls.createBoard, {}, [className])}>
			<Popover
				className={cls.popover}
				trigger={trigger}
				anchorTo="right"
			>
				{({ close }) => (
					<form
						onSubmit={handleSubmit((values) => onSubmit(values, close))}
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
								validate: (value) =>
									value.trim().length > 0 || "Название доски не может быть пустым",
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

						<Checkbox
							className={cls.checkbox}
							label="Добавить в избранное"
							checked={isFavorite}
							onChange={setIsFavorite}
						/>

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
							{isLoading ? <Loader size="s" /> : "Создать"}
						</Button>
					</form>
				)}
			</Popover>
		</div>
	);
});
