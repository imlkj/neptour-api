import Booking from "../models/bookingModel.js";
import Tour from "../models/tourModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getOverview = asyncHandler(async (req, res) => {
  //1. Get tour data from collection
  const tours = await Tour.find();
  //2. Build template

  //3. Render that template using tour data from 1.
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

export const getTour = asyncHandler(async (req, res, next) => {
  //1. Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    select: "review rating user",
    populate: { path: "user", select: "name photo" },
  });

  if (!tour) {
    return next(new AppError("There is no tour with that name.", 400));
  }

  //2. Build template

  //3. Render template using data from 1.

  res.status(200).render("tour", {
    title: `${tour.name}`,
    tour,
  });
});

export const getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
};

export const getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
    user: req.user,
  });
};

export const getMyTours = asyncHandler(async (req, res, next) => {
  //1. Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  //2. Find tours with the returned IDs
  const tourIDs = bookings.map((el) => {
    return el.tour;
  });
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render("overview", {
    title: "My Tours",
    tours,
  });
});

export const updateUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});
