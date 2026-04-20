const crypto = require("crypto");
const express = require("express");
const { z } = require("zod");
const { prisma } = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { getBoardWithRole } = require("../services/access.service");
const { BOARD_PERMISSION, hasBoardPermission } = require("../utils/permissions");

const router = express.Router();

const boardIdParamsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ boardId: z.string().min(1) }),
  query: z.object({}).optional(),
});

const createBoardSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(120),
    description: z.string().max(500).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

const updateBoardSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(120).optional(),
    description: z.string().max(500).nullable().optional(),
  }),
  params: z.object({ boardId: z.string().min(1) }),
  query: z.object({}),
});

const inviteSchema = z.object({
  body: z.object({
    email: z.string().email(),
    role: z.enum(["EDITOR", "MOVER"]),
    expiresInDays: z.number().int().min(1).max(30).optional(),
  }),
  params: z.object({ boardId: z.string().min(1) }),
  query: z.object({}),
});

const updateMemberRoleSchema = z.object({
  body: z.object({
    role: z.enum(["EDITOR", "MOVER"]),
  }),
  params: z.object({
    boardId: z.string().min(1),
    memberId: z.string().min(1),
  }),
  query: z.object({}),
});

const removeMemberSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    boardId: z.string().min(1),
    memberId: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

function isAdmin(user) {
  return user.globalRole === "ADMIN";
}

async function ensureBoardPermission(req, res, boardId, permission) {
  const { board, role } = await getBoardWithRole(boardId, req.user.id);

  if (!board) {
    res.status(404).json({ message: "Board not found" });
    return null;
  }

  if (isAdmin(req.user) || hasBoardPermission(role, permission)) {
    return { board, role };
  }

  res.status(403).json({ message: "Forbidden" });
  return null;
}

router.use(requireAuth);

router.get("/", async (req, res) => {
  const boards = await prisma.board.findMany({
    where: {
      OR: [
        { ownerId: req.user.id },
        {
          members: {
            some: {
              userId: req.user.id,
            },
          },
        },
      ],
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { columns: true, members: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return res.json({ boards });
});

router.post("/", validate(createBoardSchema), async (req, res) => {
  const { title, description } = req.validated.body;

  const board = await prisma.board.create({
    data: {
      title,
      description,
      ownerId: req.user.id,
    },
  });

  return res.status(201).json({ board });
});

router.get("/:boardId", validate(boardIdParamsSchema), async (req, res) => {
  const { boardId } = req.validated.params;

  const access = await ensureBoardPermission(req, res, boardId, BOARD_PERMISSION.TASK_TOGGLE);
  if (!access) {
    return;
  }

  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      columns: {
        orderBy: { position: "asc" },
        include: {
          tasks: {
            orderBy: { position: "asc" },
            include: {
              createdBy: {
                select: { id: true, name: true, email: true },
              },
            },
          },
        },
      },
    },
  });

  return res.json({ board });
});

router.patch("/:boardId", validate(updateBoardSchema), async (req, res) => {
  const { boardId } = req.validated.params;
  const { title, description } = req.validated.body;

  const access = await ensureBoardPermission(req, res, boardId, BOARD_PERMISSION.BOARD_MANAGE);
  if (!access) {
    return;
  }

  const board = await prisma.board.update({
    where: { id: boardId },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
    },
  });

  return res.json({ board });
});

router.delete("/:boardId", validate(boardIdParamsSchema), async (req, res) => {
  const { boardId } = req.validated.params;

  const access = await ensureBoardPermission(req, res, boardId, BOARD_PERMISSION.BOARD_MANAGE);
  if (!access) {
    return;
  }

  await prisma.board.delete({ where: { id: boardId } });

  return res.status(204).send();
});

router.get("/:boardId/invitations", validate(boardIdParamsSchema), async (req, res) => {
  const { boardId } = req.validated.params;

  const access = await ensureBoardPermission(req, res, boardId, BOARD_PERMISSION.INVITE_MANAGE);
  if (!access) {
    return;
  }

  const invitations = await prisma.boardInvitation.findMany({
    where: { boardId },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ invitations });
});

router.post("/:boardId/invitations", validate(inviteSchema), async (req, res) => {
  const { boardId } = req.validated.params;
  const { email, role, expiresInDays } = req.validated.body;

  const access = await ensureBoardPermission(req, res, boardId, BOARD_PERMISSION.INVITE_MANAGE);
  if (!access) {
    return;
  }

  const board = access.board;

  if (board.ownerId === req.user.id && board.owner.email === email) {
    return res.status(400).json({ message: "Owner is already in board" });
  }

  const existingMemberUser = await prisma.user.findUnique({ where: { email } });
  if (existingMemberUser) {
    const existingMembership = await prisma.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId,
          userId: existingMemberUser.id,
        },
      },
    });

    if (existingMembership) {
      return res.status(409).json({ message: "User is already a member" });
    }
  }

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + (expiresInDays || 7) * 24 * 60 * 60 * 1000);

  const invitation = await prisma.boardInvitation.upsert({
    where: {
      boardId_email: {
        boardId,
        email,
      },
    },
    create: {
      boardId,
      email,
      role,
      token,
      status: "PENDING",
      invitedById: req.user.id,
      expiresAt,
    },
    update: {
      role,
      token,
      status: "PENDING",
      invitedById: req.user.id,
      expiresAt,
    },
  });

  return res.status(201).json({ invitation });
});

router.patch("/:boardId/members/:memberId", validate(updateMemberRoleSchema), async (req, res) => {
  const { boardId, memberId } = req.validated.params;
  const { role } = req.validated.body;

  const access = await ensureBoardPermission(req, res, boardId, BOARD_PERMISSION.INVITE_MANAGE);
  if (!access) {
    return;
  }

  const member = await prisma.boardMember.findUnique({ where: { id: memberId } });

  if (!member || member.boardId !== boardId) {
    return res.status(404).json({ message: "Member not found" });
  }

  const updatedMember = await prisma.boardMember.update({
    where: { id: memberId },
    data: { role },
  });

  return res.json({ member: updatedMember });
});

router.delete("/:boardId/members/:memberId", validate(removeMemberSchema), async (req, res) => {
  const { boardId, memberId } = req.validated.params;

  const access = await ensureBoardPermission(req, res, boardId, BOARD_PERMISSION.INVITE_MANAGE);
  if (!access) {
    return;
  }

  const member = await prisma.boardMember.findUnique({ where: { id: memberId } });

  if (!member || member.boardId !== boardId) {
    return res.status(404).json({ message: "Member not found" });
  }

  await prisma.boardMember.delete({ where: { id: memberId } });

  return res.status(204).send();
});

module.exports = router;
