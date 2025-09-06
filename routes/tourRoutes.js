import express from "express";
import * as tourController from "../controllers/tourController.js";
import * as authController from "../controllers/authController.js";
import { router as reviewRouter } from "./reviewRoutes.js";

const router = express.Router();
router.use("/:tourId/reviews", reviewRouter);
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTour, tourController.getAllTours);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTours,
  );

router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour,
  );

export { router };
