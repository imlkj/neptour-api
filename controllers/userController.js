import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import sharp from "sharp";

import { User } from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import * as factory from "./factoryHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

// eslint-disable-next-line no-unused-vars
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../dev-data/data/users.json")),
);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const createUser = (req, res) => {
  res.status(201).json({
    status: "error",
    message: "This route is not defined! Please use signUp instead",
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

export const getUser = factory.getOne(User);

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const updateMe = async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);

  //1. Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatePassword.",
        400,
      ),
    );
  }

  //*. Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  //2. Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
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
