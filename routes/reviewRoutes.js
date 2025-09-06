import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import * as authController from "../controllers/authController.js";

export const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserId,
    reviewController.createReview,
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(authController.restrictTo("user"), reviewController.updateReview)
  .delete(reviewController.deleteReview);
