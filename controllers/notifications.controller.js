import asyncHandler from "express-async-handler";
import Notification from "../models/notification.model.js";
import { resFormat } from "../utiles/responseFormat.utiles.js";

export const getLoggedUserNotifications = asyncHandler(
  async (req, res, next) => {
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    let skip = (page - 1) * limit;
    const notifications = await Notification.find(
      { userId: req.user._id },
      "-__v"
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json(resFormat("", "", notifications));
  }
);
