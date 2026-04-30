import { memo, useEffect, useState } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./BackgroundList.module.scss";
import { Button } from "../Button/Button";
import { SpriteIcon } from "../SpriteIcon/SpriteIcon";

interface BackgroundListProps {
	backgroundList: string[];
	onChange?: (bg: string) => void;
	className?: string;
}

export const BackgroundList = memo((props: BackgroundListProps) => {
	const { backgroundList, onChange, className } = props;
	const [selected, setSelected] = useState(backgroundList[0]);

	const onClick = (id: string) => {
		setSelected(id);
		onChange?.(id);
	};

	useEffect(() => {
		if (backgroundList.length > 0) {
			onChange?.(selected);
		}
	}, [backgroundList, selected, onChange]);

	return (
		<div className={classNames(cls.backgroundList, {}, [className])}>
			{backgroundList.map((bg) => (
				<Button
					key={bg}
					className={cls.item}
					theme="clear"
					onClick={() => onClick(bg)}
					style={{ background: bg }}
				>
					{selected === bg && (
						<SpriteIcon
							className={cls.checkedIcon}
							spriteId="checked-icon"
						/>
					)}
				</Button>
			))}
		</div>
	);
});
