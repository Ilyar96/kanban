const express = require("express");
const { z } = require("zod");
const { prisma } = require("../lib/prisma");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const { validate } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function mapAuthUser(user) {
	return {
		id: user.id,
		username: user.name,
		email: user.email,
		roles: [user.globalRole],
	};
}

function getLoginIdentifier(body) {
	return (
		(body.usernameOrEmail || body.login || body.email || body.username || "")
	).trim();
}

async function findUserByIdentifier(identifier) {
	const where = identifier.includes("@") ? { email: identifier } : { name: identifier };
	return prisma.user.findFirst({ where });
}

const registerSchema = z.object({
	body: z.object({
		username: z.string().min(2).max(80).optional(),
		name: z.string().min(2).max(80).optional(),
		email: z.string().email(),
		password: z.string().min(6).max(100),
	}).refine((data) => Boolean((data.username || data.name || "").trim()), {
		message: "Username is required",
		path: ["username"],
	}),
	params: z.object({}),
	query: z.object({}),
});

const loginSchema = z.object({
	body: z.object({
		usernameOrEmail: z.string().min(2).max(120),
		password: z.string().min(6).max(100),
	}),
	params: z.object({}),
	query: z.object({}),
});

router.post("/register", validate(registerSchema), async (req, res) => {
	const { email, password } = req.validated.body;
	const username = (req.validated.body.username || req.validated.body.name || "").trim();

	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		return res.status(409).json({ message: "Пользователь с таким email уже существует" });
	}

	const existingUsername = await prisma.user.findFirst({ where: { name: username } });
	if (existingUsername) {
		return res.status(409).json({ message: "Имя пользователя уже занято" });
	}

	const passwordHash = await hashPassword(password);

	const user = await prisma.user.create({
		data: {
			name: username,
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

	return res.status(201).json({ user: mapAuthUser(user), token });
});

router.post("/login", validate(loginSchema, { hideDetails: true }), async (req, res) => {
	const { password } = req.validated.body;
	const identifier = getLoginIdentifier(req.validated.body);

	const user = await findUserByIdentifier(identifier);
	if (!user) {
		return res.status(401).json({ message: "Неверные учетные данные" });
	}

	const isPasswordValid = await comparePassword(password, user.passwordHash);
	if (!isPasswordValid) {
		return res.status(401).json({ message: "Неверные учетные данные" });
	}

	const token = signToken({ sub: user.id, role: user.globalRole });

	return res.json({
		user: mapAuthUser(user),
		token,
	});
});

router.get("/me", requireAuth, async (req, res) => {
	return res.json({ user: mapAuthUser(req.user) });
});

module.exports = router;
