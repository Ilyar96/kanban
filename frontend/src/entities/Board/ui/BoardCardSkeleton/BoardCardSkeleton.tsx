import { classNames } from "@/shared/lib/classNames/classNames";
import { Card } from "@/shared/ui/Card/Card";
import cls from "../BoardCard/BoardCard.module.scss";
import { Skeleton } from "@/shared/ui/Skeleton/Skeleton";

interface BoardCardSkeletonProps {
	className?: string;
}

export const BoardCardSkeleton = ({ className }: BoardCardSkeletonProps) => {
	return (
		<Card className={classNames(cls.boardCard, {}, [className])}>
			<Skeleton
				className={cls.boardBackground}
				height={80}
			/>
			<div className={cls.footer}>
				<Skeleton
					width="60%"
					height={20}
				/>
			</div>
		</Card>
	);
};
