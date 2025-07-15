import { app } from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./config.env" });

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
app.listen(port, "127.0.0.1", () => {
  console.log(`App running on port ${port}`);
});
