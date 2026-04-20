const { prisma } = require("../lib/prisma");

async function getBoardWithRole(boardId, userId) {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      owner: {
        select: { id: true, email: true, name: true },
      },
    },
  });

  if (!board) {
    return { board: null, role: null };
  }

  if (board.ownerId === userId) {
    return { board, role: "OWNER" };
  }

  const membership = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId,
      },
    },
  });

  return { board, role: membership?.role || null };
}

async function getBoardByColumn(columnId) {
  return prisma.column.findUnique({
    where: { id: columnId },
    include: {
      board: true,
    },
  });
}

async function getTaskWithBoard(taskId) {
  return prisma.task.findUnique({
    where: { id: taskId },
    include: {
      column: {
        include: {
          board: true,
        },
      },
    },
  });
}

module.exports = {
  getBoardWithRole,
  getBoardByColumn,
  getTaskWithBoard,
};
