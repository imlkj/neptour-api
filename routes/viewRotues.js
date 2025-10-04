import express from "express";
import * as viewsController from "../controllers/viewsController.js";
import * as authController from "../controllers/authController.js";
import * as bookingController from "../controllers/bookingController.js";

export const router = express.Router();

router.get(
  "/",
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview,
);
router.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/me", authController.protect, viewsController.getAccount);

router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData,
);
