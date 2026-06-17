require("dotenv").config();

const { prisma } = require("../lib/prisma");

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

async function main() {
	try {
		await prisma.$connect();
		await prisma.$disconnect();
		// eslint-disable-next-line no-console
		console.log(`[db:check] OK: database is reachable at ${getDatabaseAddress()}`);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(`[db:check] FAILED: ${error.message}`);
		// eslint-disable-next-line no-console
		console.error("[db:check] Verify DATABASE_URL in backend/.env and start PostgreSQL before backend startup.");
		// eslint-disable-next-line no-console
		console.error("[db:check] Local service option: start PostgreSQL service on your machine.");
		// eslint-disable-next-line no-console
		console.error("[db:check] Docker option: ensure Docker daemon is running and container publishes port 5432.");
		process.exit(1);
	}
}

main();
