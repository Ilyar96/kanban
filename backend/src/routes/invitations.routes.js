const express = require("express");
const { z } = require("zod");
const { prisma } = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

const router = express.Router();

const tokenSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    token: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

router.use(requireAuth);

router.post("/:token/accept", validate(tokenSchema), async (req, res) => {
  const { token } = req.validated.params;

  const invitation = await prisma.boardInvitation.findUnique({
    where: { token },
    include: { board: true },
  });

  if (!invitation) {
    return res.status(404).json({ message: "Invitation not found" });
  }

  if (invitation.status !== "PENDING") {
    return res.status(400).json({ message: "Invitation is not active" });
  }

  if (new Date(invitation.expiresAt).getTime() < Date.now()) {
    await prisma.boardInvitation.update({
      where: { id: invitation.id },
      data: { status: "EXPIRED" },
    });
    return res.status(400).json({ message: "Invitation is expired" });
  }

  if (invitation.email !== req.user.email) {
    return res.status(403).json({ message: "Invitation belongs to another email" });
  }

  if (invitation.board.ownerId === req.user.id) {
    await prisma.boardInvitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" },
    });
    return res.json({ message: "Owner is already in board" });
  }

  await prisma.$transaction(async (tx) => {
    await tx.boardMember.upsert({
      where: {
        boardId_userId: {
          boardId: invitation.boardId,
          userId: req.user.id,
        },
      },
      create: {
        boardId: invitation.boardId,
        userId: req.user.id,
        role: invitation.role,
      },
      update: {
        role: invitation.role,
      },
    });

    await tx.boardInvitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" },
    });
  });

  return res.json({ message: "Invitation accepted" });
});

router.post("/:token/decline", validate(tokenSchema), async (req, res) => {
  const { token } = req.validated.params;

  const invitation = await prisma.boardInvitation.findUnique({ where: { token } });

  if (!invitation) {
    return res.status(404).json({ message: "Invitation not found" });
  }

  if (invitation.email !== req.user.email) {
    return res.status(403).json({ message: "Invitation belongs to another email" });
  }

  await prisma.boardInvitation.update({
    where: { id: invitation.id },
    data: { status: "DECLINED" },
  });

  return res.json({ message: "Invitation declined" });
});

module.exports = router;
