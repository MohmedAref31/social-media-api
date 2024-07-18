import express from "express";
import upload from "../middlewares/uploadFileToMemory.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { saveChatMediaFilesFromMemory } from "../middlewares/saveChatMediaFilesFromMemory.js";
import {
    getMsgsValidate,
  sendMsgValidate,
  updateMsgValidate,
} from "../utiles/validators/chatMsg.validators.js";
import { deleteMessage, getMessages, getChats, sendMessage, updateMessage } from "../controllers/chat.controller.js";

const router = express.Router();

router.post(
  "/messages",
  isLoggedIn,
  upload.fields([{ name: "media", maxCount: 10 }]),
  sendMsgValidate,
  saveChatMediaFilesFromMemory,
  sendMessage
);
router.get("/", isLoggedIn, getChats)
router.get('/messages/:otherUserId', isLoggedIn,getMsgsValidate, getMessages)
router.route("/messages/:msgId")
.patch(isLoggedIn, updateMsgValidate, updateMessage)
.delete(isLoggedIn, deleteMessage)


export default router;
