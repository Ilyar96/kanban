function notFoundHandler(req, res) {
  res.status(404).json({ message: "Route not found" });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.statusCode || 500;
  return res.status(status).json({
    message: error.message || "Internal server error",
  });
}

module.exports = { notFoundHandler, errorHandler };
