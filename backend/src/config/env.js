const env = {
	port: Number(process.env.PORT || 4000),
	jwtSecret: process.env.JWT_SECRET || "super-secret-change-me",
	jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
	dbConnectRetries: Number(process.env.DB_CONNECT_RETRIES || 10),
	dbConnectRetryDelayMs: Number(process.env.DB_CONNECT_RETRY_DELAY_MS || 1500),
};

module.exports = { env };
