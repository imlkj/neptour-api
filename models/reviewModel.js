import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      maxLength: [500, "A review should be no more than 500 characters"],
    },
    rating: {
      type: Number,
      default: 0,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    createdAt: {
      type: Date,
      default: Date().now,
      select: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A review must be passed by user."],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "A reviw must belong to a tour."],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "user", select: "name photo" },
    // { path: "tour", select: "name" },
  ]);
  next();
});

export const Review = mongoose.model("Review", reviewSchema);
