import express from "express";
import authRoutes from "./auth.route.js";
import usersRoutes from "./users.route.js";
import friendRequestRoutes from "./friendRequest.route.js"
import postRoutes from "./post.route.js"
import statusRoutes from "./status.route.js"
import commentRoutes from './comment.route.js'
import searchRoutes from './search.route.js'
import notificationRoutes from "./notifications.route.js"
import { ApiError } from "../utiles/errorClass.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/friend-requests", friendRequestRoutes)
router.use("/posts", postRoutes);
router.use("/status", statusRoutes);
router.use('/comments', commentRoutes);
router.use('/search', searchRoutes)
router.use('/notifications', notificationRoutes)
router.all("*", (req, res,next)=>{
    next(new ApiError(`sorry there is no such a route ${req.originalUrl}`, "fail", 404))
})
export default router
