const env = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "super-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

module.exports = { env };
