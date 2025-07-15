import express from "express";
import * as tourController from "../controllers/tourController.js";

const router = express.Router();

// router.param("id", tourController.checkId);

//Create a checkBody middleware
//Check if body contains the name and price propterty
//If not, send back 400 (bad request)
//Add it to the post handler stack

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTours);
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export { router };
