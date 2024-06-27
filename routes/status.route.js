import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
// import upload from "../middlewares/uploadFile.js";
import upload from "../middlewares/uploadFileToMemory.js";
import saveStatusFileFromMemory from "../middlewares/saveStatusFileFromMemory.js";
import { createStatusValidate } from "../utiles/validators/status.validators.js";
import {
  addLikeToStatus,
  addViewToStatus,
  createStatus,
  deleteStatus,
  getFriendsStatus,
  getStatusById,
} from "../controllers/status.controller.js";

const router = express.Router();

router.get('/', isLoggedIn, getFriendsStatus)

router.post(
  "/",
  isLoggedIn,
  upload.single("media"),
  createStatusValidate,
  saveStatusFileFromMemory,
  createStatus
);

router
  .route("/:statusId")
  .delete(isLoggedIn, deleteStatus)
  .get(isLoggedIn, getStatusById);

router.post("/:statusId/likes", isLoggedIn, addLikeToStatus);
router.post("/:statusId/views", isLoggedIn, addViewToStatus);

export default router;
