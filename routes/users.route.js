import express from "express";
import {  getUser, getUserFriends, updateMe, updateMyImage, updateMyPassword } from "../controllers/users.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { updateMeValidate, updateMyPassowrd } from "../utiles/validators/user.validators.js";
import upload from "../middlewares/uploadFile.js";
const router = express.Router();

router.get('/:id',isLoggedIn ,getUser)
router.get("/:id/friends",isLoggedIn, getUserFriends)
router.patch('/update-me', isLoggedIn, updateMeValidate, updateMe)
router.patch('/update-my-password', isLoggedIn, updateMyPassowrd, updateMyPassword)
router.patch('/update-my-image', isLoggedIn, upload.single('profileImage'), updateMyImage)

export default router;
