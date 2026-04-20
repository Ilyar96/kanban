const express = require("express");
const { z } = require("zod");
const { prisma } = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { getBoardByColumn, getBoardWithRole, getTaskWithBoard } = require("../services/access.service");
const { BOARD_PERMISSION, hasBoardPermission } = require("../utils/permissions");

const router = express.Router();

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
  }),
  params: z.object({
    columnId: z.string().min(1),
  }),
  query: z.object({}),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).nullable().optional(),
  }),
  params: z.object({
    taskId: z.string().min(1),
  }),
  query: z.object({}),
});

const taskIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    taskId: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

const moveTaskSchema = z.object({
  body: z.object({
    targetColumnId: z.string().min(1),
    targetPosition: z.number().int().min(0).optional(),
  }),
  params: z.object({
    taskId: z.string().min(1),
  }),
  query: z.object({}),
});

function isAdmin(user) {
  return user.globalRole === "ADMIN";
}

async function reindexTasks(tx, columnId, taskIds) {
  for (let index = 0; index < taskIds.length; index += 1) {
    await tx.task.update({
      where: { id: taskIds[index] },
      data: { position: index, columnId },
    });
  }
}

router.use(requireAuth);

router.post("/columns/:columnId/tasks", validate(createTaskSchema), async (req, res) => {
  const { columnId } = req.validated.params;
  const { title, description } = req.validated.body;

  const columnWithBoard = await getBoardByColumn(columnId);
  if (!columnWithBoard) {
    return res.status(404).json({ message: "Column not found" });
  }

  const { role } = await getBoardWithRole(columnWithBoard.boardId, req.user.id);
  if (!isAdmin(req.user) && !hasBoardPermission(role, BOARD_PERMISSION.TASK_MANAGE)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const maxPosition = await prisma.task.aggregate({
    where: { columnId },
    _max: { position: true },
  });

  const task = await prisma.task.create({
    data: {
      title,
      description,
      columnId,
      createdById: req.user.id,
      position: (maxPosition._max.position ?? -1) + 1,
    },
  });

  return res.status(201).json({ task });
});

router.patch("/:taskId", validate(updateTaskSchema), async (req, res) => {
  const { taskId } = req.validated.params;
  const { title, description } = req.validated.body;

  const taskWithBoard = await getTaskWithBoard(taskId);
  if (!taskWithBoard) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { role } = await getBoardWithRole(taskWithBoard.column.boardId, req.user.id);
  if (!isAdmin(req.user) && !hasBoardPermission(role, BOARD_PERMISSION.TASK_MANAGE)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
    },
  });

  return res.json({ task });
});

router.delete("/:taskId", validate(taskIdSchema), async (req, res) => {
  const { taskId } = req.validated.params;

  const taskWithBoard = await getTaskWithBoard(taskId);
  if (!taskWithBoard) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { role } = await getBoardWithRole(taskWithBoard.column.boardId, req.user.id);
  if (!isAdmin(req.user) && !hasBoardPermission(role, BOARD_PERMISSION.TASK_MANAGE)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await prisma.$transaction(async (tx) => {
    await tx.task.delete({ where: { id: taskId } });

    const restTasks = await tx.task.findMany({
      where: { columnId: taskWithBoard.columnId },
      orderBy: { position: "asc" },
      select: { id: true },
    });

    await reindexTasks(
      tx,
      taskWithBoard.columnId,
      restTasks.map((item) => item.id),
    );
  });

  return res.status(204).send();
});

router.patch("/:taskId/toggle", validate(taskIdSchema), async (req, res) => {
  const { taskId } = req.validated.params;

  const taskWithBoard = await getTaskWithBoard(taskId);
  if (!taskWithBoard) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { role } = await getBoardWithRole(taskWithBoard.column.boardId, req.user.id);
  if (!isAdmin(req.user) && !hasBoardPermission(role, BOARD_PERMISSION.TASK_TOGGLE)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      completed: !taskWithBoard.completed,
    },
  });

  return res.json({ task });
});

router.patch("/:taskId/move", validate(moveTaskSchema), async (req, res) => {
  const { taskId } = req.validated.params;
  const { targetColumnId, targetPosition } = req.validated.body;

  const taskWithBoard = await getTaskWithBoard(taskId);
  if (!taskWithBoard) {
    return res.status(404).json({ message: "Task not found" });
  }

  const targetColumn = await getBoardByColumn(targetColumnId);
  if (!targetColumn) {
    return res.status(404).json({ message: "Target column not found" });
  }

  if (targetColumn.boardId !== taskWithBoard.column.boardId) {
    return res.status(400).json({ message: "Cannot move task between different boards" });
  }

  const { role } = await getBoardWithRole(taskWithBoard.column.boardId, req.user.id);
  if (!isAdmin(req.user) && !hasBoardPermission(role, BOARD_PERMISSION.TASK_MOVE)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const sourceColumnId = taskWithBoard.columnId;

  await prisma.$transaction(async (tx) => {
    if (sourceColumnId === targetColumnId) {
      const tasksInColumn = await tx.task.findMany({
        where: { columnId: sourceColumnId },
        orderBy: { position: "asc" },
        select: { id: true },
      });

      const taskIds = tasksInColumn.map((item) => item.id).filter((id) => id !== taskId);
      const insertAt = Math.min(Math.max(targetPosition ?? taskIds.length, 0), taskIds.length);
      taskIds.splice(insertAt, 0, taskId);

      await reindexTasks(tx, sourceColumnId, taskIds);
      return;
    }

    const sourceTasks = await tx.task.findMany({
      where: { columnId: sourceColumnId },
      orderBy: { position: "asc" },
      select: { id: true },
    });

    const targetTasks = await tx.task.findMany({
      where: { columnId: targetColumnId },
      orderBy: { position: "asc" },
      select: { id: true },
    });

    const sourceTaskIds = sourceTasks.map((item) => item.id).filter((id) => id !== taskId);
    const targetTaskIds = targetTasks.map((item) => item.id);

    const insertAt = Math.min(Math.max(targetPosition ?? targetTaskIds.length, 0), targetTaskIds.length);
    targetTaskIds.splice(insertAt, 0, taskId);

    await reindexTasks(tx, sourceColumnId, sourceTaskIds);
    await reindexTasks(tx, targetColumnId, targetTaskIds);
  });

  const movedTask = await prisma.task.findUnique({ where: { id: taskId } });
  return res.json({ task: movedTask });
});

module.exports = router;
