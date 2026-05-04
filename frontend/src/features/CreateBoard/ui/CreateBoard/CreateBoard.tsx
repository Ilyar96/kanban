import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/shared/ui/Button/Button";
import { useCreateBoardMutation } from "../../model/api/createBoardApi";
import cls from "./CreateBoard.module.scss";
import { appToast } from "@/shared/lib/toast";
import { BoardForm, type BoardFormSubmitValues } from "@/entities/Board";

interface CreateBoardProps {
	className?: string;
	triggerClassName?: string;
}
export const CreateBoard = memo((props: CreateBoardProps) => {
	const { className, triggerClassName } = props;
	const [createBoard, { isLoading, error }] = useCreateBoardMutation();

	const errorMessage = useMemo(() => {
		if (!error || !("data" in error)) return "";
		const payload = error.data as { message?: string };
		return payload?.message ?? "Не удалось создать доску";
	}, [error]);

	const onSubmit = useCallback(
		async (values: BoardFormSubmitValues) => {
			try {
				await createBoard({
					title: values.title,
					description: values.description,
					visibility: values.visibility,
					backgroundColor: values.backgroundColor,
					isFavorite: values.isFavorite,
				}).unwrap();

				appToast.success("Доска успешно создана");
			} catch {
				// Error text is handled by RTK Query `error` state.
			}
		},
		[createBoard],
	);

	useEffect(() => {
		if (error) {
			appToast.error(errorMessage);
		}
	}, [error, errorMessage]);

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
		<BoardForm
			className={classNames(cls.createBoard, {}, [className])}
			trigger={trigger}
			onSubmit={onSubmit}
			isLoading={isLoading}
			errorMessage={errorMessage}
			submitText="Создать доску"
		/>
	);
});
