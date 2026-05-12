import { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

interface PersistMoveParams<T> {
	activeId: string;
	overId: string;
	oldIndex: number;
	newIndex: number;
	prevItems: T[];
	nextItems: T[];
}

interface UseOptimisticSortableParams<T> {
	sourceItems: T[];
	getId: (item: T) => string;
	getPosition: (item: T) => number;
	setPosition: (item: T, position: number) => T;
	onPersistMove: (params: PersistMoveParams<T>) => Promise<void>;
	onPersistError?: (error: unknown) => void;
}

interface UseOptimisticSortableResult<T> {
	items: T[];
	onDragEnd: (event: DragEndEvent) => Promise<void>;
	setItems: Dispatch<SetStateAction<T[]>>;
}

export const useOptimisticSortable = <T>(
	params: UseOptimisticSortableParams<T>,
): UseOptimisticSortableResult<T> => {
	const { sourceItems, getId, getPosition, setPosition, onPersistMove, onPersistError } = params;

	const sortedSourceItems = useMemo(
		() => [...sourceItems].sort((a, b) => getPosition(a) - getPosition(b)),
		[sourceItems, getPosition],
	);

	const sourceSignature = useMemo(
		() => sortedSourceItems.map((item) => `${getId(item)}:${getPosition(item)}`).join("|"),
		[sortedSourceItems, getId, getPosition],
	);

	const [optimisticState, setOptimisticState] = useState(() => ({
		items: sortedSourceItems,
		signature: sourceSignature,
	}));
	const [hasOptimisticOverride, setHasOptimisticOverride] = useState(false);

	const signatureFromItems = useCallback(
		(itemsToSign: T[]) =>
			itemsToSign.map((item) => `${getId(item)}:${getPosition(item)}`).join("|"),
		[getId, getPosition],
	);

	const isSyncedWithSource = optimisticState.signature === sourceSignature;
	const items =
		!hasOptimisticOverride || isSyncedWithSource ? sortedSourceItems : optimisticState.items;

	const setItems = useCallback<Dispatch<SetStateAction<T[]>>>(
		(updater) => {
			setHasOptimisticOverride(true);
			setOptimisticState((prev) => {
				const baseItems = prev.signature === sourceSignature ? sortedSourceItems : prev.items;
				const nextItems =
					typeof updater === "function" ? (updater as (prevState: T[]) => T[])(baseItems) : updater;

				return {
					items: nextItems,
					signature: signatureFromItems(nextItems),
				};
			});
		},
		[sourceSignature, sortedSourceItems, signatureFromItems],
	);

	const onDragEnd = useCallback(
		async (event: DragEndEvent) => {
			const { active, over } = event;
			if (!over || active.id === over.id) {
				return;
			}

			const activeId = String(active.id);
			const overId = String(over.id);
			const oldIndex = items.findIndex((item) => getId(item) === activeId);
			const newIndex = items.findIndex((item) => getId(item) === overId);

			if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
				return;
			}

			const prevItems = items;
			const nextItems = arrayMove(items, oldIndex, newIndex).map((item, index) =>
				setPosition(item, index),
			);

			setHasOptimisticOverride(true);

			setOptimisticState({
				items: nextItems,
				signature: signatureFromItems(nextItems),
			});

			try {
				await onPersistMove({
					activeId,
					overId,
					oldIndex,
					newIndex,
					prevItems,
					nextItems,
				});
			} catch (error) {
				setOptimisticState({
					items: prevItems,
					signature: signatureFromItems(prevItems),
				});
				onPersistError?.(error);
			}
		},
		[items, getId, setPosition, onPersistMove, onPersistError, signatureFromItems],
	);

	return {
		items,
		onDragEnd,
		setItems,
	};
};
