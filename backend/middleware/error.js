const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong Mongoose Object ID Error
  if (err.name === "CastError") {
    const message =
      "Resource not found. Please check the ID. Invalid: " + err.path;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose Validation Error duplicate key
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong JWT error

  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Please log in again.";
    err = new ErrorHandler(message, 400);
  }
  // JWT token expired

  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token is expired. Please log in again.";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    // error: err.stack
  });
};
