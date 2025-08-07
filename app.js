import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import qs from "qs";

import { router as tourRouter } from "./routes/tourRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import AppError from "./utils/appError.js";
import { globalErrorHandler } from "./controllers/errorHandler.js";

export const app = express();
dotenv.config({ path: "./config.env" });

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.set("query parser", (str) => qs.parse(str));
app.use(express.json());
app.use(express.static(`./public`));

// Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//NOTE use regex here
app.all(/.*/, (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = "fail";
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
