const ErrorHandler = (err, req, res, next) => {
  console.error(err);

  // Show error based on status code or 500 for default error status code
  const status = err.statusCode || 500;

  res.status(status).json({
    message: err.message || "Internal Server Error",
  });
}

export default ErrorHandler;