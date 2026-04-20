import { memo } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./PageError.module.scss";

interface PageErrorProps {
	className?: string;
	title?: string;
	btnText?: string;
	onBtnClick?: () => void;
	hideBtn?: boolean;
}

export const PageError = memo((props: PageErrorProps) => {
	const { className, title, btnText, hideBtn, onBtnClick } = props;

	const reloadPage = () => {
		location.reload();
	};

	return (
		<div className={classNames(cls.PageError, {}, [className])}>
			<p className={cls.PageErrorTitle}>{title || "Произошла непредвиденная ошибка"}</p>
			{!hideBtn && (
				<button
					className={cls.PageErrorButton}
					onClick={onBtnClick || reloadPage}
				>
					{btnText || "Обновить страницу"}
				</button>
			)}
		</div>
	);
});
