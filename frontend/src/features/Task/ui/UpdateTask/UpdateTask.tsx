import { classNames } from "@/shared/lib/classNames/classNames";
import { memo } from "react";

interface UpdateTaskProps {
	className?: string;
}

export const UpdateTask = memo(({ className }: UpdateTaskProps) => {
	return (
		<div className={classNames("", {}, [className])}>
			{/* TODO */}
			{/* Содержимое UpdateTask */}
		</div>
	);
});
