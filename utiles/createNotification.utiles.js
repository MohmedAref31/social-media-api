import Notification from "../models/notification.model.js";
import { io } from "../server.js";
export const createNotification = async (msg, userId) => {
  try {
    const notification = new Notification({
      message: msg,
      userId,
      createdAt: Date.now(),
    });
    notification
      .save()
      .then((n) => {
        const userSocket = onlineUsers.get(userId);
        if(userSocket)
        io.to(userSocket).emit(`notification`, msg);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};
