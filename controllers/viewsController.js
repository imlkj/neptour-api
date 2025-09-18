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

export const getTour = (req, res) => {
  res.status(200).render("tour", {
    title: "The Forest Hiker",
  });
};
