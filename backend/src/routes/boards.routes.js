const crypto = require("crypto");
const express = require("express");
const { z } = require("zod");
const { prisma } = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { getBoardWithRole } = require("../services/access.service");
const { BOARD_PERMISSION, hasBoardPermission } = require("../utils/permissions");

const router = express.Router();

const visibilitySchema = z.enum(["PRIVATE", "WORKSPACE", "PUBLIC"]);
const backgroundColorSchema = z.string().min(1).max(2048);
const sortBySchema = z.enum(["updatedAt", "createdAt", "title"]);
const sortOrderSchema = z.enum(["asc", "desc"]);

function parseFavoritesOnly(value) {
	if (value === undefined) return false;
	if (typeof value === "boolean") return value;

	const normalizedValue = value.trim().toLowerCase();
	if (normalizedValue === "true" || normalizedValue === "1") return true;
	if (normalizedValue === "false" || normalizedValue === "0") return false;

	return false;
}

function buildBoardOrderBy(sortBy, sortOrder) {
	if (sortBy === "title") {
		return { title: sortOrder };
	}

	return { [sortBy]: sortOrder };
}

const boardIdParamsSchema = z.object({
	body: z.object({}).optional(),
	params: z.object({ boardId: z.string().min(1) }),
	query: z.object({}).optional(),
});

const boardDetailsQuerySchema = z.object({
	body: z.object({}).optional(),
	params: z.object({ boardId: z.string().min(1) }),
	query: z.object({
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).max(100).default(10),
		favoritesOnly: z
			.union([z.boolean(), z.string()])
			.optional()
			.transform(parseFavoritesOnly),
		sortBy: sortBySchema.default("updatedAt"),
		sortOrder: sortOrderSchema.default("desc"),
	}),
});

const ownerBoardsListSchema = z.object({
	body: z.object({}).optional(),
	params: z.object({ userId: z.string().min(1) }),
	query: z.object({
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).max(100).default(10),
		favoritesOnly: z
			.union([z.boolean(), z.string()])
			.optional()
			.transform(parseFavoritesOnly),
		sortBy: sortBySchema.default("updatedAt"),
		sortOrder: sortOrderSchema.default("desc"),
	}),
});

const createBoardSchema = z.object({
	body: z.object({
		title: z.string().min(1).max(120),
		description: z.string().max(500).optional(),
		visibility: visibilitySchema.optional(),
		backgroundColor: backgroundColorSchema.optional(),
		isFavorite: z.boolean().optional(),
	}),
	params: z.object({}),
	query: z.object({}),
});

const updateBoardSchema = z.object({
	body: z.object({
		title: z.string().min(1).max(120).optional(),
		description: z.string().max(500).nullable().optional(),
		visibility: visibilitySchema.optional(),
		backgroundColor: backgroundColorSchema.nullable().optional(),
	}),
	params: z.object({ boardId: z.string().min(1) }),
	query: z.object({}),
});

const favoriteBoardSchema = z.object({
	body: z.object({}).optional(),
	params: z.object({ boardId: z.string().min(1) }),
	query: z.object({}).optional(),
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

const removeInvitationSchema = z.object({
	body: z.object({}).optional(),
	params: z.object({
		boardId: z.string().min(1),
		invitationId: z.string().min(1),
	}),
	query: z.object({}).optional(),
});

const boardsListSchema = z.object({
	body: z.object({}).optional(),
	params: z.object({}).optional(),
	query: z.object({
		page: z.coerce.number().int().min(1).default(1),
		limit: z.coerce.number().int().min(1).max(100).default(10),
		favoritesOnly: z
			.union([z.boolean(), z.string()])
			.optional()
			.transform(parseFavoritesOnly),
		sortBy: sortBySchema.default("updatedAt"),
		sortOrder: sortOrderSchema.default("desc"),
	}),
});

function isAdmin(user) {
	return user.globalRole === "ADMIN";
}

function canViewBoard(board, role, user) {
	if (!board) return false;
	if (isAdmin(user)) return true;
	if (board.ownerId === user.id) return true;
	if (board.visibility === "PUBLIC") return true;
	if (board.visibility === "WORKSPACE") return Boolean(role);
	return false;
}

async function ensureBoardPermission(req, res, boardId, permission) {
	const { board, role } = await getBoardWithRole(boardId, req.user.id);

	if (!board) {
		res.status(404).json({ message: "Доска не найдена" });
		return null;
	}

	if (isAdmin(req.user) || hasBoardPermission(role, permission)) {
		return { board, role };
	}

	res.status(403).json({ message: "Недостаточно прав" });
	return null;
}

router.use(requireAuth);

router.get("/", validate(boardsListSchema), async (req, res) => {
	const { page, limit, favoritesOnly, sortBy, sortOrder } = req.validated.query;
	const skip = (page - 1) * limit;

	const boardVisibilityWhere = {
		OR: [
			{ ownerId: req.user.id },
			{
				AND: [
					{ visibility: "WORKSPACE" },
					{
						members: {
							some: {
								userId: req.user.id,
							},
						},
					},
				],
			},
			{ visibility: "PUBLIC" },
		],
	};

	const where = favoritesOnly
		? {
			AND: [
				boardVisibilityWhere,
				{
					favorites: {
						some: {
							userId: req.user.id,
						},
					},
				},
			],
		}
		: boardVisibilityWhere;

	const totalItems = await prisma.board.count({ where });

	const boards = await prisma.board.findMany({
		where,
		include: {
			owner: {
				select: { id: true, name: true, email: true },
			},
			favorites: {
				where: {
					userId: req.user.id,
				},
				select: { id: true },
			},
			_count: {
				select: { columns: true, members: true },
			},
		},
		skip,
		take: limit,
		orderBy: buildBoardOrderBy(sortBy, sortOrder),
	});

	const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);
	const isLastPage = totalPages === 0 || page >= totalPages;

	const mappedBoards = boards.map((board) => ({
		...board,
		isFavorite: board.favorites.length > 0,
		favorites: undefined,
	}));

	return res.json({
		boards: mappedBoards,
		page,
		limit,
		totalItems,
		totalPages,
		isLastPage,
	});
});


router.get("/by-owner/:userId", validate(ownerBoardsListSchema), async (req, res) => {
	const { userId } = req.validated.params;
	const { page, limit, favoritesOnly, sortBy, sortOrder } = req.validated.query;
	const skip = (page - 1) * limit;
	const canViewAllOwnerBoards = isAdmin(req.user) || req.user.id === userId;

	const visibilityWhere = canViewAllOwnerBoards
		? {}
		: {
			OR: [
				{ visibility: "PUBLIC" },
				{
					AND: [
						{ visibility: "WORKSPACE" },
						{
							members: {
								some: {
									userId: req.user.id,
								},
							},
						},
					],
				},
			],
		};

	const where = {
		ownerId: userId,
		...visibilityWhere,
		...(favoritesOnly
			? {
				favorites: {
					some: {
						userId: req.user.id,
					},
				},
			}
			: {}),
	};

	const totalItems = await prisma.board.count({ where });

	const boards = await prisma.board.findMany({
		where: {
			...where,
		},
		include: {
			owner: {
				select: { id: true, name: true, email: true },
			},
			favorites: {
				where: {
					userId: req.user.id,
				},
				select: { id: true },
			},
			_count: {
				select: { columns: true, members: true },
			},
		},
		skip,
		take: limit,
		orderBy: buildBoardOrderBy(sortBy, sortOrder),
	});

	const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);
	const isLastPage = totalPages === 0 || page >= totalPages;

	const mappedBoards = boards.map((board) => ({
		...board,
		isFavorite: board.favorites.length > 0,
		favorites: undefined,
	}));

	return res.json({
		boards: mappedBoards,
		page,
		limit,
		totalItems,
		totalPages,
		isLastPage,
	});
});

router.post("/", validate(createBoardSchema), async (req, res) => {
	const { title, description, visibility, backgroundColor, isFavorite } = req.validated.body;
	const normalizedTitle = title.trim();

	if (!normalizedTitle) {
		return res.status(400).json({ message: "Название доски не может быть пустым" });
	}

	const ownerBoards = await prisma.board.findMany({
		where: { ownerId: req.user.id },
		select: { title: true },
	});

	const normalizedTitleLower = normalizedTitle.toLocaleLowerCase();
	const hasBoardWithSameTitle = ownerBoards.some(
		(boardItem) => boardItem.title.trim().toLocaleLowerCase() === normalizedTitleLower,
	);

	if (hasBoardWithSameTitle) {
		return res.status(409).json({ message: "Доска с таким названием уже существует" });
	}

	const board = await prisma.board.create({
		data: {
			title: normalizedTitle,
			description,
			visibility,
			backgroundColor,
			ownerId: req.user.id,
			...(isFavorite
				? {
					favorites: {
						create: {
							userId: req.user.id,
						},
					},
				}
				: {}),
		},
		include: {
			favorites: {
				where: {
					userId: req.user.id,
				},
				select: { id: true },
			},
		},
	});

	return res.status(201).json({
		board: {
			...board,
			isFavorite: board.favorites.length > 0,
			favorites: undefined,
		},
	});
});

router.get("/:boardId", validate(boardDetailsQuerySchema), async (req, res) => {
	const { boardId } = req.validated.params;
	const { page, limit, favoritesOnly } = req.validated.query;
	const columnsSkip = (page - 1) * limit;

	const { board: boardAccess, role } = await getBoardWithRole(boardId, req.user.id);
	if (!canViewBoard(boardAccess, role, req.user)) {
		return res.status(404).json({ message: "Доска не найдена" });
	}

	const columnsOrderBy = { position: "asc" };
	const tasksOrderBy = { position: "asc" };

	const totalColumns = await prisma.column.count({
		where: { boardId },
	});

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
				orderBy: columnsOrderBy,
				skip: columnsSkip,
				take: limit,
				include: {
					tasks: {
						orderBy: tasksOrderBy,
						include: {
							createdBy: {
								select: { id: true, name: true, email: true },
							},
						},
					},
				},
			},
			favorites: {
				where: {
					userId: req.user.id,
				},
				select: { id: true },
			},
		},
	});

	if (!board) {
		return res.status(404).json({ message: "Доска не найдена" });
	}

	const isFavorite = board.favorites.length > 0;
	if (favoritesOnly && !isFavorite) {
		return res.status(404).json({ message: "Доска не найдена" });
	}

	const totalPages = totalColumns === 0 ? 0 : Math.ceil(totalColumns / limit);
	const isLastPage = totalPages === 0 || page >= totalPages;

	return res.json({
		board: {
			...board,
			isFavorite,
			favorites: undefined,
		},
		page,
		limit,
		totalItems: totalColumns,
		totalPages,
		isLastPage,
	});
});

router.patch("/:boardId", validate(updateBoardSchema), async (req, res) => {
	const { boardId } = req.validated.params;
	const { title, description, visibility, backgroundColor } = req.validated.body;

	const access = await ensureBoardPermission(req, res, boardId, BOARD_PERMISSION.BOARD_MANAGE);
	if (!access) {
		return;
	}

	const board = await prisma.board.update({
		where: { id: boardId },
		data: {
			...(title !== undefined ? { title } : {}),
			...(description !== undefined ? { description } : {}),
			...(visibility !== undefined ? { visibility } : {}),
			...(backgroundColor !== undefined ? { backgroundColor } : {}),
		},
		include: {
			favorites: {
				where: {
					userId: req.user.id,
				},
				select: { id: true },
			},
		},
	});

	return res.json({
		board: {
			...board,
			isFavorite: board.favorites.length > 0,
			favorites: undefined,
		},
	});
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

	if (board.visibility === "PRIVATE") {
		return res.status(400).json({
			message: "Для приватной доски приглашения недоступны",
		});
	}

	if (board.ownerId === req.user.id && board.owner.email === email) {
		return res.status(400).json({ message: "Владелец уже находится на доске" });
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
			return res.status(409).json({
				message: "Пользователь уже является участником доски. Удалите участника, чтобы пригласить повторно.",
			});
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

router.delete(
	"/:boardId/invitations/:invitationId",
	validate(removeInvitationSchema),
	async (req, res) => {
		const { boardId, invitationId } = req.validated.params;

		const access = await ensureBoardPermission(req, res, boardId, BOARD_PERMISSION.INVITE_MANAGE);
		if (!access) {
			return;
		}

		const invitation = await prisma.boardInvitation.findUnique({ where: { id: invitationId } });

		if (!invitation || invitation.boardId !== boardId) {
			return res.status(404).json({ message: "Приглашение не найдено" });
		}

		await prisma.$transaction(async (tx) => {
			if (invitation.status === "ACCEPTED") {
				const invitedUser = await tx.user.findUnique({ where: { email: invitation.email } });

				if (invitedUser && invitedUser.id !== access.board.ownerId) {
					await tx.boardMember.deleteMany({
						where: {
							boardId,
							userId: invitedUser.id,
						},
					});
				}
			}

			await tx.boardInvitation.delete({ where: { id: invitationId } });
		});

		return res.status(204).send();
	},
);
router.patch("/:boardId/members/:memberId", validate(updateMemberRoleSchema), async (req, res) => {
	const { boardId, memberId } = req.validated.params;
	const { role } = req.validated.body;

	const access = await ensureBoardPermission(req, res, boardId, BOARD_PERMISSION.INVITE_MANAGE);
	if (!access) {
		return;
	}

	const member = await prisma.boardMember.findUnique({ where: { id: memberId } });

	if (!member || member.boardId !== boardId) {
		return res.status(404).json({ message: "Участник не найден" });
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
		return res.status(404).json({ message: "Участник не найден" });
	}

	await prisma.boardMember.delete({ where: { id: memberId } });

	return res.status(204).send();
});

router.post("/:boardId/favorite", validate(favoriteBoardSchema), async (req, res) => {
	const { boardId } = req.validated.params;

	const { board, role } = await getBoardWithRole(boardId, req.user.id);
	if (!canViewBoard(board, role, req.user)) {
		return res.status(404).json({ message: "Доска не найдена" });
	}

	const favorite = await prisma.boardFavorite.upsert({
		where: {
			boardId_userId: {
				boardId,
				userId: req.user.id,
			},
		},
		create: {
			boardId,
			userId: req.user.id,
		},
		update: {},
	});

	return res.status(201).json({ favorite });
});

router.delete("/:boardId/favorite", validate(favoriteBoardSchema), async (req, res) => {
	const { boardId } = req.validated.params;

	const { board, role } = await getBoardWithRole(boardId, req.user.id);
	if (!canViewBoard(board, role, req.user)) {
		return res.status(404).json({ message: "Доска не найдена" });
	}

	await prisma.boardFavorite.deleteMany({
		where: {
			boardId,
			userId: req.user.id,
		},
	});

	return res.status(204).send();
});

module.exports = router;
