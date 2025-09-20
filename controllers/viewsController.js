import Tour from "../models/tourModel.js";
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
    fields: "review rating user",
  });

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
  })
};
