import app from "./app.js";
import mongoose from "mongoose";

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception! Shutting down...");
  console.log(err.name, err.message);
  throw err;
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log(`DB conection sucessful`);
  })
  .catch((err) => console.error(err));

const port = process.env.PORT || 8000;
const server = app.listen(port, "127.0.0.1", () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error(err.name, err.message);
  console.log("Unhandled rejection! Shutting down...");
  server.close(() => {
    throw err;
  });
});
