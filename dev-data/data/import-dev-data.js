import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Tour from "../../models/tourModel.js";
import { Review } from "../../models/reviewModel.js";
import { User } from "../../models/userModel.js";

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always resolve absolute path
dotenv.config({ path: path.resolve(__dirname, "../../config.env") });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log(`DB connection successful`);
  })
  .catch((err) => console.error(err));

const tours = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../data/tours.json"), "utf-8"),
);
const users = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../data/users.json"), "utf-8"),
);
const reviews = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../data/reviews.json"), "utf-8"),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data successfully loaded");
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data deleted successful");
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
