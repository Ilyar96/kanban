const { app } = require("./app");
const { env } = require("./config/env");
const { prisma } = require("./lib/prisma");

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function getDatabaseAddress() {
	const databaseUrl = process.env.DATABASE_URL;

	if (!databaseUrl) {
		return "DATABASE_URL is not set";
	}

	try {
		const parsed = new URL(databaseUrl);
		const port = parsed.port || "5432";
		return `${parsed.hostname}:${port}`;
	} catch {
		return "DATABASE_URL is invalid";
	}
}

async function connectToDatabase() {
	for (let attempt = 1; attempt <= env.dbConnectRetries; attempt += 1) {
		try {
			await prisma.$connect();
			// eslint-disable-next-line no-console
			console.log(`[db] Connected to ${getDatabaseAddress()}`);
			return;
		} catch (error) {
			const isLastAttempt = attempt === env.dbConnectRetries;

			// eslint-disable-next-line no-console
			console.error(`[db] Connection attempt ${attempt}/${env.dbConnectRetries} failed: ${error.message}`);

			if (isLastAttempt) {
				// eslint-disable-next-line no-console
				console.error("[db] Failed to connect to database. Check DATABASE_URL and ensure PostgreSQL is running.");
				// eslint-disable-next-line no-console
				console.error("[db] If you use local PostgreSQL service, make sure it listens on the host/port from DATABASE_URL.");
				// eslint-disable-next-line no-console
				console.error("[db] If you use Docker, make sure Docker daemon is running and port 5432 is published.");
				throw error;
			}

			await sleep(env.dbConnectRetryDelayMs);
		}
	}
}

let isShuttingDown = false;

async function shutdown(signal) {
	if (isShuttingDown) {
		return;
	}

	isShuttingDown = true;

	// eslint-disable-next-line no-console
	console.log(`[server] ${signal} received, closing database connection...`);

	await prisma.$disconnect();
	process.exit(0);
}

process.on("SIGINT", () => {
	shutdown("SIGINT");
});

process.on("SIGTERM", () => {
	shutdown("SIGTERM");
});

async function start() {
	try {
		await connectToDatabase();

		app.listen(env.port, () => {
			// eslint-disable-next-line no-console
			console.log(`Server started on http://localhost:${env.port}`);
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(`[server] Startup failed: ${error.message}`);
		process.exit(1);
	}
}

start();
