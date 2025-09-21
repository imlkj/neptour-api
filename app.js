import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import qs from "qs";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";

import { sanitizeInputs } from "./middlewares/sanitize.js";
import { router as tourRouter } from "./routes/tourRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import { router as reviewRouter } from "./routes/reviewRoutes.js";
import AppError from "./utils/appError.js";
import { globalErrorHandler } from "./controllers/errorHandler.js";
import { router as viewRouter } from "./routes/viewRotues.js";

export const app = express();

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "pug");
app.set("views", path.resolve(__dirname, "./views"));

// Always resolve absolute path
dotenv.config({ path: path.resolve(__dirname, "./config.env") });

// Global Middlewares

// Serving static files
app.use(express.static(path.resolve(__dirname, "public")));

// Set security HTTP header
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com", // required for the font files
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://a.tile.openstreetmap.org",
        "https://b.tile.openstreetmap.org",
        "https://c.tile.openstreetmap.org",
      ],
      connectSrc: ["'self'", "http://127.0.0.1:3000"],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"],
    },
  }),
);

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
app.use(cookieParser());


// Data sanitization against NoSQL and XSS
app.use(sanitizeInputs);

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  }),
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
  // console.log(req.cookies);
});

// Routes
app.use("/", viewRouter);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

//NOTE use regex here
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
