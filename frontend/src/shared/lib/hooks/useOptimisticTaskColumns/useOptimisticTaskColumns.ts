import { useCallback, useMemo, useRef, useState } from "react";
import type { DragCancelEvent, DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import type { BoardColumn, Task } from "@/shared/types/board";

interface PersistTaskMoveParams {
	taskId: string;
	sourceColumnId: string;
	targetColumnId: string;
	targetPosition: number;
}

interface UseOptimisticTaskColumnsParams {
	columns: BoardColumn[];
	onPersistMove: (params: PersistTaskMoveParams) => Promise<void>;
	onPersistError?: (error: unknown) => void;
}

interface UseOptimisticTaskColumnsResult {
	getColumnTasks: (columnId: string) => Task[];
	activeTask: Task | null;
	onDragStart: (event: DragStartEvent) => void;
	onDragOver: (event: DragOverEvent) => void;
	onDragEnd: (event: DragEndEvent) => Promise<void>;
	onDragCancel: (event: DragCancelEvent) => void;
}

type TasksByColumn = Record<string, Task[]>;

interface DraggableMeta {
	type?: "task" | "column";
	columnId?: string;
}

function buildTasksByColumn(columns: BoardColumn[]): TasksByColumn {
	const result: TasksByColumn = {};

	columns.forEach((column) => {
		result[column.id] = [...column.tasks].sort((a, b) => a.position - b.position);
	});

	return result;
}

function buildSignature(tasksByColumn: TasksByColumn): string {
	return Object.keys(tasksByColumn)
		.sort()
		.map((columnId) => `${columnId}:${tasksByColumn[columnId].map((task) => task.id).join(",")}`)
		.join("|");
}

function resolveContainerId(
	target: { data: { current?: unknown } } | null | undefined,
): string | undefined {
	if (!target) {
		return undefined;
	}

	const data = target.data.current as DraggableMeta | undefined;

	if (data?.type === "task" || data?.type === "column") {
		return data.columnId;
	}

	return undefined;
}

function resolveOverContainerId(
	over: { id: unknown; data: { current?: unknown } } | null | undefined,
) {
	const containerId = resolveContainerId(over);
	if (containerId) {
		return containerId;
	}

	const overId = String(over?.id ?? "");
	if (overId.startsWith("dropzone-")) {
		return overId.replace("dropzone-", "");
	}

	return undefined;
}

function findTaskContainer(tasksByColumn: TasksByColumn, taskId: string): string | undefined {
	return Object.keys(tasksByColumn).find((columnId) =>
		tasksByColumn[columnId]?.some((task) => task.id === taskId),
	);
}

export const useOptimisticTaskColumns = (
	params: UseOptimisticTaskColumnsParams,
): UseOptimisticTaskColumnsResult => {
	const { columns, onPersistMove, onPersistError } = params;

	const sourceTasksByColumn = useMemo(() => buildTasksByColumn(columns), [columns]);
	const sourceSignature = useMemo(() => buildSignature(sourceTasksByColumn), [sourceTasksByColumn]);

	const [optimisticState, setOptimisticState] = useState(() => ({
		tasksByColumn: sourceTasksByColumn,
		signature: sourceSignature,
	}));
	const [hasOptimisticOverride, setHasOptimisticOverride] = useState(false);
	const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
	const dragStartSnapshotRef = useRef<TasksByColumn | null>(null);

	const isSyncedWithSource = optimisticState.signature === sourceSignature;
	const tasksByColumn =
		!hasOptimisticOverride || isSyncedWithSource
			? sourceTasksByColumn
			: optimisticState.tasksByColumn;

	const getColumnTasks = useCallback(
		(columnId: string) => tasksByColumn[columnId] ?? [],
		[tasksByColumn],
	);

	const activeTask = useMemo(() => {
		if (!activeTaskId) {
			return null;
		}

		for (const tasks of Object.values(tasksByColumn)) {
			const found = tasks.find((task) => task.id === activeTaskId);
			if (found) {
				return found;
			}
		}

		return null;
	}, [activeTaskId, tasksByColumn]);

	const revertToSnapshot = useCallback(() => {
		const snapshot = dragStartSnapshotRef.current;
		if (!snapshot) {
			return;
		}

		setOptimisticState({ tasksByColumn: snapshot, signature: buildSignature(snapshot) });
	}, []);

	const onDragStart = useCallback(
		(event: DragStartEvent) => {
			setActiveTaskId(String(event.active.id));
			dragStartSnapshotRef.current = tasksByColumn;
		},
		[tasksByColumn],
	);

	const onDragOver = useCallback(
		(event: DragOverEvent) => {
			const { active, over } = event;
			if (!over) {
				return;
			}

			const overContainer = resolveOverContainerId(over);

			if (!overContainer) {
				return;
			}

			const activeId = String(active.id);
			const overId = String(over.id);

			setOptimisticState((prev) => {
				const base = prev.signature === sourceSignature ? sourceTasksByColumn : prev.tasksByColumn;
				const activeContainer = findTaskContainer(base, activeId);

				if (!activeContainer || activeContainer === overContainer) {
					return prev;
				}

				const sourceItems = base[activeContainer];
				const activeIndex = sourceItems?.findIndex((task) => task.id === activeId) ?? -1;

				if (activeIndex < 0) {
					return prev;
				}

				const movingTask = sourceItems[activeIndex];
				const destItems = base[overContainer] ?? [];
				const overIndex = destItems.findIndex((task) => task.id === overId);
				const insertAt = overIndex >= 0 ? overIndex : destItems.length;

				const nextTasksByColumn: TasksByColumn = {
					...base,
					[activeContainer]: sourceItems.filter((task) => task.id !== activeId),
					[overContainer]: [
						...destItems.slice(0, insertAt),
						movingTask,
						...destItems.slice(insertAt),
					],
				};

				return {
					tasksByColumn: nextTasksByColumn,
					signature: buildSignature(nextTasksByColumn),
				};
			});
			setHasOptimisticOverride(true);
		},
		[sourceSignature, sourceTasksByColumn],
	);

	const onDragCancel = useCallback(() => {
		setActiveTaskId(null);
		revertToSnapshot();
	}, [revertToSnapshot]);

	const onDragEnd = useCallback(
		async (event: DragEndEvent) => {
			const { active, over } = event;
			const activeId = String(active.id);
			setActiveTaskId(null);

			if (!over) {
				revertToSnapshot();
				return;
			}

			const overContainer = resolveOverContainerId(over);

			if (!overContainer) {
				revertToSnapshot();
				return;
			}

			const overId = String(over.id);
			const base =
				optimisticState.signature === sourceSignature
					? sourceTasksByColumn
					: optimisticState.tasksByColumn;
			const activeContainer = findTaskContainer(base, activeId);

			if (!activeContainer) {
				revertToSnapshot();
				return;
			}

			const sourceContainerAtStart = findTaskContainer(
				dragStartSnapshotRef.current ?? sourceTasksByColumn,
				activeId,
			);
			const sourceItems = base[activeContainer];
			const activeIndex = sourceItems?.findIndex((task) => task.id === activeId) ?? -1;

			if (activeIndex < 0) {
				revertToSnapshot();
				return;
			}

			const movingTask = sourceItems[activeIndex];
			const withoutActive = sourceItems.filter((task) => task.id !== activeId);
			const destBase =
				activeContainer === overContainer ? withoutActive : (base[overContainer] ?? []);
			const overIndex = destBase.findIndex((task) => task.id === overId);
			const overIndexInSource = sourceItems.findIndex((task) => task.id === overId);
			const isMovingDownWithinSameColumn =
				activeContainer === overContainer &&
				overIndexInSource >= 0 &&
				activeIndex < overIndexInSource;
			const insertAtBase = overIndex >= 0 ? overIndex : destBase.length;
			const insertAt =
				isMovingDownWithinSameColumn && overIndex >= 0 ? insertAtBase + 1 : insertAtBase;

			if (
				activeContainer === overContainer &&
				(insertAt === activeIndex || overId === activeId) &&
				sourceContainerAtStart === overContainer
			) {
				return;
			}

			const destItems = [...destBase.slice(0, insertAt), movingTask, ...destBase.slice(insertAt)];

			const nextTasksByColumn: TasksByColumn =
				activeContainer === overContainer
					? { ...base, [activeContainer]: destItems }
					: { ...base, [activeContainer]: withoutActive, [overContainer]: destItems };

			setOptimisticState({
				tasksByColumn: nextTasksByColumn,
				signature: buildSignature(nextTasksByColumn),
			});
			setHasOptimisticOverride(true);

			try {
				await onPersistMove({
					taskId: activeId,
					sourceColumnId: sourceContainerAtStart ?? activeContainer,
					targetColumnId: overContainer,
					targetPosition: insertAt,
				});
			} catch (error) {
				revertToSnapshot();
				onPersistError?.(error);
			}
		},
		[
			optimisticState,
			sourceSignature,
			sourceTasksByColumn,
			onPersistMove,
			onPersistError,
			revertToSnapshot,
		],
	);

	return {
		getColumnTasks,
		activeTask,
		onDragStart,
		onDragOver,
		onDragEnd,
		onDragCancel,
	};
};
