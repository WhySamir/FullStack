// Global error handler middleware
import { ApiError } from "../utlis/ApiError.js";

export const globalErrorHandler = (err, req, res, next) => {
  // If the error is an instance of ApiError, use its properties
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // For other types of errors, return a generic error response
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
