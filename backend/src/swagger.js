const swaggerJsDoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.3",
		info: {
			title: "Kanban API",
			version: "1.0.0",
			description:
				"Backend for kanban board (Trello-like) with JWT auth, board roles and invitations.\n\n" +
				"How to pass token:\n" +
				"1. Get JWT from /api/auth/login or /api/auth/register.\n" +
				"2. For protected endpoints send header: Authorization: Bearer <your_jwt_token>.\n" +
				"3. In Swagger UI click Authorize and paste only token value or full Bearer token (depends on UI behavior).",
		},
		servers: [{ url: "http://localhost:4000" }],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description:
						"JWT auth via Authorization header. Example: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
				},
			},
			schemas: {
				GlobalRole: {
					type: "string",
					enum: ["USER", "ADMIN"],
				},
				BoardVisibility: {
					type: "string",
					enum: ["PRIVATE", "WORKSPACE", "PUBLIC"],
				},
				BoardRole: {
					type: "string",
					enum: ["OWNER", "EDITOR", "MOVER"],
				},
				InvitationStatus: {
					type: "string",
					enum: ["PENDING", "ACCEPTED", "DECLINED", "EXPIRED"],
				},
				ErrorResponse: {
					type: "object",
					required: ["message"],
					properties: {
						message: { type: "string" },
					},
				},
				ValidationErrorResponse: {
					type: "object",
					required: ["message", "issues"],
					properties: {
						message: {
							type: "string",
							example: "Validation error",
						},
						issues: {
							type: "object",
							additionalProperties: true,
						},
					},
				},
				User: {
					type: "object",
					required: ["id", "username", "email", "globalRole"],
					properties: {
						id: { type: "string" },
						username: { type: "string" },
						email: { type: "string", format: "email" },
						globalRole: {
							type: "array",
							items: {
								$ref: "#/components/schemas/GlobalRole",
							},
						},
					},
				},
				UserShort: {
					type: "object",
					required: ["id", "name", "email"],
					properties: {
						id: { type: "string" },
						name: { type: "string" },
						email: { type: "string", format: "email" },
					},
				},
				AuthTokenResponse: {
					type: "object",
					required: ["user", "token"],
					properties: {
						user: {
							$ref: "#/components/schemas/User",
						},
						token: {
							type: "string",
							description: "JWT token",
						},
					},
				},
				Board: {
					type: "object",
					required: ["id", "title", "visibility", "ownerId", "createdAt", "updatedAt"],
					properties: {
						id: { type: "string" },
						title: { type: "string" },
						description: {
							type: "string",
							nullable: true,
						},
						visibility: {
							$ref: "#/components/schemas/BoardVisibility",
						},
						backgroundColor: {
							type: "string",
							nullable: true,
							description: "Hex color or background URL",
						},
						isFavorite: {
							type: "boolean",
							description: "Is board in current user's favorites",
						},
						ownerId: { type: "string" },
						createdAt: {
							type: "string",
							format: "date-time",
						},
						updatedAt: {
							type: "string",
							format: "date-time",
						},
					},
				},
				BoardListItem: {
					allOf: [
						{ $ref: "#/components/schemas/Board" },
						{
							type: "object",
							required: ["owner", "_count"],
							properties: {
								owner: {
									$ref: "#/components/schemas/UserShort",
								},
								_count: {
									type: "object",
									required: ["columns", "members"],
									properties: {
										columns: { type: "integer" },
										members: { type: "integer" },
									},
								},
							},
						},
					],
				},
				BoardListResponse: {
					type: "object",
					required: ["boards", "page", "limit", "totalItems", "totalPages", "isLastPage"],
					properties: {
						boards: {
							type: "array",
							items: {
								$ref: "#/components/schemas/BoardListItem",
							},
						},
						page: {
							type: "integer",
							minimum: 1,
						},
						limit: {
							type: "integer",
							minimum: 1,
							maximum: 100,
						},
						totalItems: {
							type: "integer",
							minimum: 0,
						},
						totalPages: {
							type: "integer",
							minimum: 0,
						},
						isLastPage: {
							type: "boolean",
						},
					},
				},
				Column: {
					type: "object",
					required: ["id", "title", "position", "boardId", "createdAt", "updatedAt"],
					properties: {
						id: { type: "string" },
						title: { type: "string" },
						position: { type: "integer" },
						boardId: { type: "string" },
						createdAt: {
							type: "string",
							format: "date-time",
						},
						updatedAt: {
							type: "string",
							format: "date-time",
						},
					},
				},
				Task: {
					type: "object",
					required: [
						"id",
						"title",
						"completed",
						"position",
						"columnId",
						"createdById",
						"createdAt",
						"updatedAt",
					],
					properties: {
						id: { type: "string" },
						title: { type: "string" },
						description: {
							type: "string",
							nullable: true,
						},
						completed: { type: "boolean" },
						position: { type: "integer" },
						columnId: { type: "string" },
						createdById: { type: "string" },
						createdAt: {
							type: "string",
							format: "date-time",
						},
						updatedAt: {
							type: "string",
							format: "date-time",
						},
					},
				},
				TaskWithCreator: {
					allOf: [
						{ $ref: "#/components/schemas/Task" },
						{
							type: "object",
							required: ["createdBy"],
							properties: {
								createdBy: {
									$ref: "#/components/schemas/UserShort",
								},
							},
						},
					],
				},
				BoardMember: {
					type: "object",
					required: ["id", "boardId", "userId", "role", "createdAt"],
					properties: {
						id: { type: "string" },
						boardId: { type: "string" },
						userId: { type: "string" },
						role: {
							$ref: "#/components/schemas/BoardRole",
						},
						createdAt: {
							type: "string",
							format: "date-time",
						},
					},
				},
				BoardMemberWithUser: {
					allOf: [
						{ $ref: "#/components/schemas/BoardMember" },
						{
							type: "object",
							required: ["user"],
							properties: {
								user: {
									$ref: "#/components/schemas/UserShort",
								},
							},
						},
					],
				},
				ColumnWithTasks: {
					allOf: [
						{ $ref: "#/components/schemas/Column" },
						{
							type: "object",
							required: ["tasks"],
							properties: {
								tasks: {
									type: "array",
									items: {
										$ref: "#/components/schemas/TaskWithCreator",
									},
								},
							},
						},
					],
				},
				BoardDetails: {
					allOf: [
						{ $ref: "#/components/schemas/Board" },
						{
							type: "object",
							required: ["owner", "members", "columns"],
							properties: {
								owner: {
									$ref: "#/components/schemas/UserShort",
								},
								members: {
									type: "array",
									items: {
										$ref: "#/components/schemas/BoardMemberWithUser",
									},
								},
								columns: {
									type: "array",
									items: {
										$ref: "#/components/schemas/ColumnWithTasks",
									},
								},
							},
						},
					],
				},
				BoardDetailsResponse: {
					type: "object",
					required: ["board", "page", "limit", "totalItems", "totalPages", "isLastPage"],
					properties: {
						board: {
							$ref: "#/components/schemas/BoardDetails",
						},
						page: {
							type: "integer",
							minimum: 1,
						},
						limit: {
							type: "integer",
							minimum: 1,
							maximum: 100,
						},
						totalItems: {
							type: "integer",
							minimum: 0,
							description: "Total columns count in board",
						},
						totalPages: {
							type: "integer",
							minimum: 0,
						},
						isLastPage: {
							type: "boolean",
						},
					},
				},
				Invitation: {
					type: "object",
					required: [
						"id",
						"token",
						"boardId",
						"email",
						"role",
						"status",
						"invitedById",
						"expiresAt",
						"createdAt",
						"updatedAt",
					],
					properties: {
						id: { type: "string" },
						token: { type: "string" },
						boardId: { type: "string" },
						email: { type: "string", format: "email" },
						role: {
							$ref: "#/components/schemas/BoardRole",
						},
						status: {
							$ref: "#/components/schemas/InvitationStatus",
						},
						invitedById: { type: "string" },
						expiresAt: {
							type: "string",
							format: "date-time",
						},
						createdAt: {
							type: "string",
							format: "date-time",
						},
						updatedAt: {
							type: "string",
							format: "date-time",
						},
					},
				},
				MessageResponse: {
					type: "object",
					required: ["message"],
					properties: {
						message: { type: "string" },
					},
				},
			},
			parameters: {
				BoardId: {
					name: "boardId",
					in: "path",
					required: true,
					schema: { type: "string" },
				},
				UserId: {
					name: "userId",
					in: "path",
					required: true,
					schema: { type: "string" },
				},
				ColumnId: {
					name: "columnId",
					in: "path",
					required: true,
					schema: { type: "string" },
				},
				TaskId: {
					name: "taskId",
					in: "path",
					required: true,
					schema: { type: "string" },
				},
				MemberId: {
					name: "memberId",
					in: "path",
					required: true,
					schema: { type: "string" },
				},
				InvitationToken: {
					name: "token",
					in: "path",
					required: true,
					schema: { type: "string" },
				},
			},
		},
		tags: [
			{ name: "Auth" },
			{ name: "Boards" },
			{ name: "Columns" },
			{ name: "Tasks" },
			{ name: "Invitations" },
		],
		paths: {
			"/api/auth/register": {
				post: {
					tags: ["Auth"],
					summary: "Register user",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["username", "email", "password"],
									properties: {
										username: { type: "string", minLength: 2, maxLength: 80 },
										name: {
											type: "string",
											minLength: 2,
											maxLength: 80,
											description: "Deprecated alias for username",
										},
										email: { type: "string", format: "email" },
										password: { type: "string", minLength: 6, maxLength: 100 },
									},
								},
							},
						},
					},
					responses: {
						201: {
							description: "User created",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/AuthTokenResponse",
									},
								},
							},
						},
						400: {
							description: "Validation error",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/ValidationErrorResponse",
									},
								},
							},
						},
						409: {
							description: "User already exists",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/auth/login": {
				post: {
					tags: ["Auth"],
					summary: "Login user",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["usernameOrEmail", "password"],
									properties: {
										usernameOrEmail: {
											type: "string",
											description: "Email or username",
										},
										password: { type: "string", minLength: 6, maxLength: 100 },
									},
								},
							},
						},
					},
					responses: {
						200: {
							description: "Login successful",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/AuthTokenResponse",
									},
								},
							},
						},
						400: {
							description: "Validation error",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/ValidationErrorResponse",
									},
								},
							},
						},
						401: {
							description: "Invalid credentials",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/auth/me": {
				get: {
					tags: ["Auth"],
					summary: "Get current user",
					security: [{ bearerAuth: [] }],
					responses: {
						200: {
							description: "Current user",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["user"],
										properties: {
											user: {
												$ref: "#/components/schemas/User",
											},
										},
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/boards": {
				get: {
					tags: ["Boards"],
					summary: "Get user boards with pagination",
					description:
						"Returns boards available for current user. Supports pagination, filtering only favorite boards and sorting.",
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: "page",
							in: "query",
							required: false,
							schema: {
								type: "integer",
								minimum: 1,
								default: 1,
							},
							description: "Page number (starts from 1)",
						},
						{
							name: "limit",
							in: "query",
							required: false,
							schema: {
								type: "integer",
								minimum: 1,
								maximum: 100,
								default: 10,
							},
							description: "Number of items per page",
						},
						{
							name: "favoritesOnly",
							in: "query",
							required: false,
							schema: {
								type: "boolean",
								default: false,
							},
							description: "When true returns only boards that are in current user's favorites",
						},
						{
							name: "sortBy",
							in: "query",
							required: false,
							schema: {
								type: "string",
								enum: ["updatedAt", "createdAt", "title"],
								default: "updatedAt",
							},
							description: "Field for sorting boards",
						},
						{
							name: "sortOrder",
							in: "query",
							required: false,
							schema: {
								type: "string",
								enum: ["asc", "desc"],
								default: "desc",
							},
							description: "Sort order. Default desc means newer first",
						},
					],
					responses: {
						200: {
							description: "Boards list",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/BoardListResponse",
									},
								},
							},
						},
						400: {
							description: "Validation error",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/ValidationErrorResponse",
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
				post: {
					tags: ["Boards"],
					summary: "Create board",
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["title"],
									properties: {
										title: { type: "string", minLength: 1, maxLength: 120 },
										description: { type: "string", maxLength: 500 },
										visibility: {
											$ref: "#/components/schemas/BoardVisibility",
										},
										backgroundColor: {
											type: "string",
											maxLength: 2048,
											description: "Hex color or background URL",
										},
										isFavorite: {
											type: "boolean",
											description: "Add board to favorites for current user",
										},
									},
								},
							},
						},
					},
					responses: {
						201: {
							description: "Board created",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["board"],
										properties: {
											board: { $ref: "#/components/schemas/Board" },
										},
									},
								},
							},
						},
						400: {
							description: "Validation error",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/ValidationErrorResponse",
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/boards/by-owner/{userId}": {
				get: {
					tags: ["Boards"],
					summary: "Get owner boards with pagination",
					description:
						"Returns boards of a specific owner. Owner and ADMIN see all owner's boards. Other users see only WORKSPACE/PUBLIC boards or boards where they are members. Supports pagination, filtering only favorite boards and sorting.",
					security: [{ bearerAuth: [] }],
					parameters: [
						{ $ref: "#/components/parameters/UserId" },
						{
							name: "page",
							in: "query",
							required: false,
							schema: {
								type: "integer",
								minimum: 1,
								default: 1,
							},
							description: "Page number (starts from 1)",
						},
						{
							name: "limit",
							in: "query",
							required: false,
							schema: {
								type: "integer",
								minimum: 1,
								maximum: 100,
								default: 10,
							},
							description: "Number of items per page",
						},
						{
							name: "favoritesOnly",
							in: "query",
							required: false,
							schema: {
								type: "boolean",
								default: false,
							},
							description: "When true returns only boards that are in current user's favorites",
						},
						{
							name: "sortBy",
							in: "query",
							required: false,
							schema: {
								type: "string",
								enum: ["updatedAt", "createdAt", "title"],
								default: "updatedAt",
							},
							description: "Field for sorting boards",
						},
						{
							name: "sortOrder",
							in: "query",
							required: false,
							schema: {
								type: "string",
								enum: ["asc", "desc"],
								default: "desc",
							},
							description: "Sort order. Default desc means newer first",
						},
					],
					responses: {
						200: {
							description: "Boards list by owner id",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/BoardListResponse",
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						400: {
							description: "Validation error",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/ValidationErrorResponse",
									},
								},
							},
						},
					},
				},
			},
			"/api/boards/{boardId}": {
				get: {
					tags: ["Boards"],
					summary: "Get board details with columns pagination",
					description:
						"Returns board details. Supports columns pagination, sorting and optional filtering by favoritesOnly for current user.",
					security: [{ bearerAuth: [] }],
					parameters: [
						{ $ref: "#/components/parameters/BoardId" },
						{
							name: "page",
							in: "query",
							required: false,
							schema: {
								type: "integer",
								minimum: 1,
								default: 1,
							},
							description: "Columns page number (starts from 1)",
						},
						{
							name: "limit",
							in: "query",
							required: false,
							schema: {
								type: "integer",
								minimum: 1,
								maximum: 100,
								default: 10,
							},
							description: "Columns per page",
						},
						{
							name: "favoritesOnly",
							in: "query",
							required: false,
							schema: {
								type: "boolean",
								default: false,
							},
							description: "When true returns board only if it is in current user's favorites",
						},
						{
							name: "sortBy",
							in: "query",
							required: false,
							schema: {
								type: "string",
								enum: ["updatedAt", "createdAt", "title"],
								default: "updatedAt",
							},
							description: "Field for sorting columns and tasks",
						},
						{
							name: "sortOrder",
							in: "query",
							required: false,
							schema: {
								type: "string",
								enum: ["asc", "desc"],
								default: "desc",
							},
							description: "Sort order. Default desc means newer first",
						},
					],
					responses: {
						200: {
							description: "Board details",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/BoardDetailsResponse",
									},
								},
							},
							400: {
								description: "Validation error",
								content: {
									"application/json": {
										schema: {
											$ref: "#/components/schemas/ValidationErrorResponse",
										},
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Board not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
				patch: {
					tags: ["Boards"],
					summary: "Update board (OWNER/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/BoardId" }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										title: { type: "string", minLength: 1, maxLength: 120 },
										description: {
											type: "string",
											maxLength: 500,
											nullable: true,
										},
										visibility: {
											$ref: "#/components/schemas/BoardVisibility",
										},
										backgroundColor: {
											type: "string",
											maxLength: 2048,
											nullable: true,
											description: "Hex color or background URL",
										},
									},
								},
							},
						},
					},
					responses: {
						200: {
							description: "Board updated",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["board"],
										properties: {
											board: { $ref: "#/components/schemas/Board" },
										},
									},
								},
							},
						},
						400: {
							description: "Validation error",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/ValidationErrorResponse",
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Board not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
				delete: {
					tags: ["Boards"],
					summary: "Delete board (OWNER/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/BoardId" }],
					responses: {
						204: {
							description: "Board deleted",
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Board not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/boards/{boardId}/favorite": {
				post: {
					tags: ["Boards"],
					summary: "Add board to favorites",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/BoardId" }],
					responses: {
						201: {
							description: "Board added to favorites",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["favorite"],
										properties: {
											favorite: {
												type: "object",
												required: ["id", "boardId", "userId", "createdAt"],
												properties: {
													id: { type: "string" },
													boardId: { type: "string" },
													userId: { type: "string" },
													createdAt: { type: "string", format: "date-time" },
												},
											},
										},
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Board not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
				delete: {
					tags: ["Boards"],
					summary: "Remove board from favorites",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/BoardId" }],
					responses: {
						204: {
							description: "Board removed from favorites",
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Board not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/boards/{boardId}/invitations": {
				get: {
					tags: ["Boards"],
					summary: "Get board invitations (OWNER/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/BoardId" }],
					responses: {
						200: {
							description: "Board invitations",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["invitations"],
										properties: {
											invitations: {
												type: "array",
												items: { $ref: "#/components/schemas/Invitation" },
											},
										},
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Board not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
				post: {
					tags: ["Boards"],
					summary: "Invite user to board (OWNER/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/BoardId" }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["email", "role"],
									properties: {
										email: { type: "string", format: "email" },
										role: {
											type: "string",
											enum: ["EDITOR", "MOVER"],
										},
										expiresInDays: { type: "integer", minimum: 1, maximum: 30 },
									},
								},
							},
						},
					},
					responses: {
						201: {
							description: "Invitation created or renewed",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["invitation"],
										properties: {
											invitation: { $ref: "#/components/schemas/Invitation" },
										},
									},
								},
							},
						},
						400: {
							description: "Validation or business error",
							content: {
								"application/json": {
									schema: {
										oneOf: [
											{ $ref: "#/components/schemas/ValidationErrorResponse" },
											{ $ref: "#/components/schemas/ErrorResponse" },
										],
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Board not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						409: {
							description: "User is already member",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/boards/{boardId}/members/{memberId}": {
				patch: {
					tags: ["Boards"],
					summary: "Change member role (OWNER/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [
						{ $ref: "#/components/parameters/BoardId" },
						{ $ref: "#/components/parameters/MemberId" },
					],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["role"],
									properties: {
										role: {
											type: "string",
											enum: ["EDITOR", "MOVER"],
										},
									},
								},
							},
						},
					},
					responses: {
						200: {
							description: "Member role updated",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["member"],
										properties: {
											member: {
												$ref: "#/components/schemas/BoardMember",
											},
										},
									},
								},
							},
						},
						400: {
							description: "Validation error",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/ValidationErrorResponse",
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Board/member not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
				delete: {
					tags: ["Boards"],
					summary: "Remove board member (OWNER/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [
						{ $ref: "#/components/parameters/BoardId" },
						{ $ref: "#/components/parameters/MemberId" },
					],
					responses: {
						204: {
							description: "Member removed",
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Board/member not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/columns/boards/{boardId}/columns": {
				post: {
					tags: ["Columns"],
					summary: "Create column (EDITOR+/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/BoardId" }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["title"],
									properties: {
										title: { type: "string", minLength: 1, maxLength: 120 },
									},
								},
							},
						},
					},
					responses: {
						201: {
							description: "Column created",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["column"],
										properties: {
											column: { $ref: "#/components/schemas/Column" },
										},
									},
								},
							},
						},
						400: {
							description: "Validation error",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/ValidationErrorResponse",
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Board not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/columns/{columnId}": {
				patch: {
					tags: ["Columns"],
					summary: "Update or move column (EDITOR+/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/ColumnId" }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									anyOf: [{ required: ["title"] }, { required: ["targetPosition"] }],
									properties: {
										title: { type: "string", minLength: 1, maxLength: 120 },
										targetPosition: { type: "integer", minimum: 0 },
									},
								},
							},
						},
					},
					responses: {
						200: {
							description: "Column updated",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["column"],
										properties: {
											column: { $ref: "#/components/schemas/Column" },
										},
									},
								},
							},
						},
						400: {
							description: "Validation error",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/ValidationErrorResponse",
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Column not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
				delete: {
					tags: ["Columns"],
					summary: "Delete column (EDITOR+/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/ColumnId" }],
					responses: {
						204: {
							description: "Column deleted",
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Column not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/columns/{columnId}/move": {
				patch: {
					tags: ["Columns"],
					summary: "Move column by position (EDITOR+/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/ColumnId" }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["targetPosition"],
									properties: {
										targetPosition: { type: "integer", minimum: 0 },
									},
								},
							},
						},
					},
					responses: {
						200: {
							description: "Column moved",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["column"],
										properties: {
											column: { $ref: "#/components/schemas/Column" },
										},
									},
								},
							},
						},
						400: {
							description: "Validation error",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/ValidationErrorResponse",
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Column not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/tasks/columns/{columnId}/tasks": {
				post: {
					tags: ["Tasks"],
					summary: "Create task (EDITOR+/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/ColumnId" }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["title"],
									properties: {
										title: { type: "string", minLength: 1, maxLength: 200 },
										description: { type: "string", maxLength: 2000 },
									},
								},
							},
						},
					},
					responses: {
						201: {
							description: "Task created",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["task"],
										properties: {
											task: { $ref: "#/components/schemas/Task" },
										},
									},
								},
							},
						},
						400: {
							description: "Validation error",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/ValidationErrorResponse",
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Column not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/tasks/{taskId}": {
				patch: {
					tags: ["Tasks"],
					summary: "Update task (EDITOR+/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/TaskId" }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										title: { type: "string", minLength: 1, maxLength: 200 },
										description: {
											type: "string",
											maxLength: 2000,
											nullable: true,
										},
									},
								},
							},
						},
					},
					responses: {
						200: {
							description: "Task updated",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["task"],
										properties: {
											task: { $ref: "#/components/schemas/Task" },
										},
									},
								},
							},
						},
						400: {
							description: "Validation error",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/ValidationErrorResponse",
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Task not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
				delete: {
					tags: ["Tasks"],
					summary: "Delete task (EDITOR+/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/TaskId" }],
					responses: {
						204: {
							description: "Task deleted",
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Task not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/tasks/{taskId}/toggle": {
				patch: {
					tags: ["Tasks"],
					summary: "Toggle task completed (MOVER+/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/TaskId" }],
					responses: {
						200: {
							description: "Task completion changed",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["task"],
										properties: {
											task: { $ref: "#/components/schemas/Task" },
										},
									},
								},
							},
						},
						400: {
							description: "Validation error",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/ValidationErrorResponse",
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Task not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/tasks/{taskId}/move": {
				patch: {
					tags: ["Tasks"],
					summary: "Move task in board (MOVER+/ADMIN)",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/TaskId" }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["targetColumnId"],
									properties: {
										targetColumnId: { type: "string" },
										targetPosition: { type: "integer", minimum: 0 },
									},
								},
							},
						},
					},
					responses: {
						200: {
							description: "Task moved",
							content: {
								"application/json": {
									schema: {
										type: "object",
										required: ["task"],
										properties: {
											task: { $ref: "#/components/schemas/Task" },
										},
									},
								},
							},
						},
						400: {
							description: "Validation or move rules violation",
							content: {
								"application/json": {
									schema: {
										oneOf: [
											{ $ref: "#/components/schemas/ValidationErrorResponse" },
											{ $ref: "#/components/schemas/ErrorResponse" },
										],
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Forbidden",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Task or target column not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/invitations/{token}/accept": {
				post: {
					tags: ["Invitations"],
					summary: "Accept invitation",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/InvitationToken" }],
					responses: {
						200: {
							description: "Invitation accepted",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/MessageResponse",
									},
								},
							},
						},
						400: {
							description: "Invitation is not active or expired",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Invitation belongs to another email",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Invitation not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
			"/api/invitations/{token}/decline": {
				post: {
					tags: ["Invitations"],
					summary: "Decline invitation",
					security: [{ bearerAuth: [] }],
					parameters: [{ $ref: "#/components/parameters/InvitationToken" }],
					responses: {
						200: {
							description: "Invitation declined",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/MessageResponse",
									},
								},
							},
						},
						401: {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						403: {
							description: "Invitation belongs to another email",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
						404: {
							description: "Invitation not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/ErrorResponse" },
								},
							},
						},
					},
				},
			},
		},
	},
	apis: [],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerSpec };
