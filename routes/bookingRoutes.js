import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import * as authController from "../controllers/authController.js";

export const router = express.Router();

router.use(authController.protect);

router.get("/checkout-session/:tourID", bookingController.getCheckoutSession);

router.use(authController.restrictTo("admin", "lead-guide"));

router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);
