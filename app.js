import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import qs from "qs";

import { router as tourRouter } from "./routes/tourRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";

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
