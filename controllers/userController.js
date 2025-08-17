import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../dev-data/data/users.json")),
);

export const createUser = (req, res) => {
  res.status(201).json({
    status: "success",
    data: {
      user: "<Create user>", // TODO
    },
  });
};

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      users: users,
    },
  });
});

export const getUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: "<Get user>",
    },
  });
};

export const updateUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: "<Update user>", // TODO
    },
  });
};

export const deleteUser = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
