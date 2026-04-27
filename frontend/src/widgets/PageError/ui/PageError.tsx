import { memo } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./PageError.module.scss";
import { Button } from "@/shared/ui/Button/Button";

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
				<Button
					className={cls.PageErrorButton}
					size="l"
					onClick={onBtnClick || reloadPage}
				>
					{btnText || "Обновить страницу"}
				</Button>
			)}
		</div>
	);
});
