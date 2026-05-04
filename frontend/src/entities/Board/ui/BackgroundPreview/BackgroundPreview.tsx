import { memo } from "react";
import { classNames } from "@/shared/lib/classNames/classNames";
import { HStack } from "@/shared/ui/Stack";
import { gradients } from "@/shared/const/gradients";
import cls from "./BackgroundPreview.module.scss";
import { SpriteIcon } from "@/shared/ui/SpriteIcon/SpriteIcon";

interface BackgroundPreviewProps {
	className?: string;
	background?: string;
}

export const BackgroundPreview = memo((props: BackgroundPreviewProps) => {
	const { className, background = gradients[0] } = props;

	return (
		<HStack
			className={classNames(cls.backgroundPreview, {}, [className])}
			align="center"
			justify="center"
			style={{ background }}
		>
			<SpriteIcon
				className={cls.previewIcon}
				spriteId="boards-preview"
			/>
		</HStack>
	);
});
