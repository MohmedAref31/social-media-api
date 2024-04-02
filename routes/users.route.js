import express from "express";
import {  getUser, getUserFriends } from "../controllers/users.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get('/:id',isLoggedIn ,getUser)
router.get("/:id/friends",isLoggedIn, getUserFriends)


export default router;
