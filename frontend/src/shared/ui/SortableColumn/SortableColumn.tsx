import { classNames } from "@/shared/lib/classNames/classNames";
import { memo, type CSSProperties, type ReactNode } from "react";
import cls from "./SortableColumn.module.scss";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableColumnProps {
	id: string;
	children: ReactNode;
	className?: string;
	isGhost?: boolean;
	data?: Record<string, unknown>;
}

export const SortableColumn = memo((props: SortableColumnProps) => {
	const { id, children, className, isGhost = false, data } = props;
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
		data,
	});

	const style: CSSProperties = {
		transform: CSS.Translate.toString(transform),
		transition,
		opacity: isDragging ? 0.65 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			className={classNames(
				cls.sortableColumn,
				{
					[cls.dragging]: isDragging,
					[cls.ghost]: isGhost,
				},
				[className],
			)}
			style={style}
			{...attributes}
			{...listeners}
		>
			{children}
		</div>
	);
});
