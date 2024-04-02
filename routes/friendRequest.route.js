import express from "express";
import {  acceptFriendRequest, cancelFriendRequest, getFriendRequests, sendFriendRequest } from "../controllers/friendRequest.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { acceptFriendRequestValidate, cancelFriendRequestValidate, sendFriendRequestValidate } from "../utiles/validators/friendRequest.validators.js";
const router = express.Router();

router.use(isLoggedIn)
router.get("/", getFriendRequests)
router.post("/:receiverId",sendFriendRequestValidate, sendFriendRequest);
router.post("/accept/:requestId",acceptFriendRequestValidate, acceptFriendRequest)
router.delete("/cancel/:requestId",cancelFriendRequestValidate, cancelFriendRequest)

export default router;
