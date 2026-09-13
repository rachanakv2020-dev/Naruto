const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  console.error("❌ Server Error:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal server error.",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
