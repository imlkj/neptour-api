import { after } from "node:test";
import AppError from "../utils/appError.js";

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const error = Object.values(err?.errors).map((el) => el?.message);
  const message = `Invalid input data ${error.join(". ")}`;
  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJwtExpiredError = () =>
  new AppError("Your token has expired! Please login again.", 401);

const devError = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const prodError = (res, err) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming or other unknown error: don't leak error details
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    devError(res, err);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWEbTokenError") error = handleJwtError();
    if (err.name === "TokenExpiredError") error = handleJwtExpiredError();

    prodError(res, error);
  }
};
