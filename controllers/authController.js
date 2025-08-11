import { User } from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const signUp = asyncHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});
