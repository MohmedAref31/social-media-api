import asyncHandler from "express-async-handler";
import ChatMessage from "../models/chatMsg.model.js";
import { ApiError } from "../utiles/errorClass.js";
import { io } from "../server.js";
import { resFormat } from "../utiles/responseFormat.utiles.js";
import removeFiles from "../utiles/removeFile.utiles.js";
import User from "../models/user.model.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  const { message, receiver } = req.body;
  const media = req.mediaLinks;

  const newMessage = await ChatMessage.create({
    sender: req.user._id,
    receiver,
    message,
    media,
  });

  if (!newMessage)
    return next(
      new ApiError("an error occured while sending your message", "error", 500)
    );

  let receiverSocket = onlineUsers.get(receiver);
  if (receiverSocket) {
    io.to(receiverSocket).emit("new-message", newMessage);
  }

  res
    .status(201)
    .json(resFormat("", "message has been sent successfully", newMessage));
});

export const updateMessage = asyncHandler(async (req, res, next) => {
  const { msgId } = req.params;

  const message = await ChatMessage.findById(msgId);

  if (!message)
    return next(
      new ApiError(`sorry there is no message with id ${msgId}`, "fail", 404)
    );

  if (message.sender.toString() !== req.user._id.toString())
    return next(
      new ApiError(`you are not allowed to update this message`, "fail", 403)
    );

  message.message = req.body.message;

  await message.save();

  let receiverSocket = onlineUsers.get(message.receiver.toString());
  if (receiverSocket) {
    io.to(receiverSocket).emit("update-message", message);
  }

  res.json(resFormat("", "message updated successfully", message));
});

export const deleteMessage = asyncHandler(async (req, res, next) => {
  const { msgId } = req.params;

  const message = await ChatMessage.findById(msgId);
  if (!message)
    return next(
      new ApiError(`sorry there is no message with id ${msgId}`, "fail", 404)
    );

  if (message.sender.toString() !== req.user._id.toString())
    return next(
      new ApiError(`you are not allowed to delete this message`, "fail", 403)
    );

  await ChatMessage.deleteOne({ _id: msgId });
  if (message.media.length > 0) removeFiles(...message.media);

  let receiverSocket = onlineUsers.get(message.receiver.toString());
  if (receiverSocket) {
    io.to(receiverSocket).emit("delete-message", {
      messageId: message._id,
      sender: message.sender,
      receiver: message.receiver,
    });
  }

  res.json(resFormat("", "message deleted successfully"));
});

export const getChats = asyncHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 50;
  const skip = (page - 1) * limit;

  let chats = await ChatMessage.aggregate([
    {
      $match: {
        $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      },
    },
    {
      $group: {
        _id: null,
        users: {
          $addToSet: {
            $cond: [{ $eq: ["$sender", req.user._id] }, "$receiver", "$sender"],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        users: 1,
      },
    },
  ]);
  chats = chats[0].users;
  chats = await User.find({_id:{$in: chats}}, "firstName lastName profileImage");

  res.json(resFormat("", "", chats));
});

export const getMessages = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = partInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const { otherUserId } = req.params;
  const messages = await ChatMessage.find(
    {
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id },
      ],
    },
    "-__v"
  )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("sender", "firstName lastName profileImage")
    .populate("receiver", "firstName lastName profileImage");

  res.json(resFormat("", "", messages));
});
