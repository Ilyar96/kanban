const express = require("express");
const { z } = require("zod");
const { prisma } = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { getBoardByColumn, getBoardWithRole } = require("../services/access.service");
const { BOARD_PERMISSION, hasBoardPermission } = require("../utils/permissions");

const router = express.Router();

const createColumnSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(120),
  }),
  params: z.object({
    boardId: z.string().min(1),
  }),
  query: z.object({}),
});

const updateColumnSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(120),
  }),
  params: z.object({
    columnId: z.string().min(1),
  }),
  query: z.object({}),
});

const deleteColumnSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    columnId: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

function isAdmin(user) {
  return user.globalRole === "ADMIN";
}

router.use(requireAuth);

router.post("/boards/:boardId/columns", validate(createColumnSchema), async (req, res) => {
  const { boardId } = req.validated.params;
  const { title } = req.validated.body;

  const { board, role } = await getBoardWithRole(boardId, req.user.id);

  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  if (!isAdmin(req.user) && !hasBoardPermission(role, BOARD_PERMISSION.COLUMN_MANAGE)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const maxPosition = await prisma.column.aggregate({
    where: { boardId },
    _max: { position: true },
  });

  const column = await prisma.column.create({
    data: {
      title,
      boardId,
      position: (maxPosition._max.position ?? -1) + 1,
    },
  });

  return res.status(201).json({ column });
});

router.patch("/:columnId", validate(updateColumnSchema), async (req, res) => {
  const { columnId } = req.validated.params;
  const { title } = req.validated.body;

  const columnWithBoard = await getBoardByColumn(columnId);
  if (!columnWithBoard) {
    return res.status(404).json({ message: "Column not found" });
  }

  const { role } = await getBoardWithRole(columnWithBoard.boardId, req.user.id);
  if (!isAdmin(req.user) && !hasBoardPermission(role, BOARD_PERMISSION.COLUMN_MANAGE)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const column = await prisma.column.update({
    where: { id: columnId },
    data: { title },
  });

  return res.json({ column });
});

router.delete("/:columnId", validate(deleteColumnSchema), async (req, res) => {
  const { columnId } = req.validated.params;

  const columnWithBoard = await getBoardByColumn(columnId);
  if (!columnWithBoard) {
    return res.status(404).json({ message: "Column not found" });
  }

  const { role } = await getBoardWithRole(columnWithBoard.boardId, req.user.id);
  if (!isAdmin(req.user) && !hasBoardPermission(role, BOARD_PERMISSION.COLUMN_MANAGE)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await prisma.$transaction(async (tx) => {
    await tx.column.delete({ where: { id: columnId } });

    const restColumns = await tx.column.findMany({
      where: { boardId: columnWithBoard.boardId },
      orderBy: { position: "asc" },
      select: { id: true },
    });

    for (let index = 0; index < restColumns.length; index += 1) {
      await tx.column.update({
        where: { id: restColumns[index].id },
        data: { position: index },
      });
    }
  });

  return res.status(204).send();
});

module.exports = router;
