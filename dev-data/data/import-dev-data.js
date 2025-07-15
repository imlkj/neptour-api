import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Tour from "../../models/tourModel.js";

dotenv.config({ path: "../../config.env" });

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

const tours = JSON.parse(
  fs.readFileSync("../data/tours-simple-v1.json", "utf-8"),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded");
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data deleted successfull");
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
// console.log(process.argv);
