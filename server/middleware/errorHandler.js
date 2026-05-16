const errorHandler = (err, req, res, next) => {
  console.error(err);

  // invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(404).json({
      message: "Resource not found",
    });
  }

  // mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(err.errors)
        .map((val) => val.message)
        .join(", "),
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || "Server Error",
  });
};

export default errorHandler;
