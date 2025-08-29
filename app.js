import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import qs from "qs";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import { router as tourRouter } from "./routes/tourRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import AppError from "./utils/appError.js";
import { globalErrorHandler } from "./controllers/errorHandler.js";

export const app = express();
dotenv.config({ path: "./config.env" });

// Global Middlewares
// Set security HTTP header
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.set("query parser", (str) => qs.parse(str));
app.use(express.json({ limit: "10kB" }));

// Data sanitization against NoSQL
app.use(ExpressMongoSanitize());

// Data sanitzation against XSS
app.use(xss());

// Serving static files
app.use(express.static(`./public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
});

// Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//NOTE use regex here
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
