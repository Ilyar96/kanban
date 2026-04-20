const express = require("express");
const { z } = require("zod");
const { prisma } = require("../lib/prisma");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const { validate } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(6).max(100),
  }),
  params: z.object({}),
  query: z.object({}),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  }),
  params: z.object({}),
  query: z.object({}),
});

router.post("/register", validate(registerSchema), async (req, res) => {
  const { name, email, password } = req.validated.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      globalRole: true,
      createdAt: true,
    },
  });

  const token = signToken({ sub: user.id, role: user.globalRole });

  return res.status(201).json({ user, token });
});

router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.validated.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken({ sub: user.id, role: user.globalRole });

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      globalRole: user.globalRole,
    },
    token,
  });
});

router.get("/me", requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
