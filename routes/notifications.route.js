import express from "express"
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { getLoggedUserNotifications } from "../controllers/notifications.controller.js";

const router = express.Router();

router.get('/', isLoggedIn, getLoggedUserNotifications)

export default router