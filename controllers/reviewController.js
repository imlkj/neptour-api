import { Review } from "../models/reviewModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

export const createReview = asyncHandler(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});
