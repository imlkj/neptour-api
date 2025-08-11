import express from "express";
import * as userController from "../controllers/userController.js";
import { signUp } from "../controllers/authController.js";


const router = express.Router();
// router.param("id", checkId);

router.post("/signUp", signUp);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export { router };
