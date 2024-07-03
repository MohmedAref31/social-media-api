import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { ApiError } from "../utiles/errorClass.js";
import { resFormat } from "../utiles/responseFormat.utiles.js";
import { objectSanitizer } from "../utiles/sanitization.js";
import FriendRequest from "../models/friendRequest.model.js";
import mongoose from "mongoose";


export const getFriendRequests = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  console.log(id.toString());
  const friendRequests = await FriendRequest.find()
    .or([{ sender: id }, { receiver: id }])
    .populate("sender receiver", "firstName profileImage");
  res.json(resFormat("", "",  friendRequests ));
});

export const sendFriendRequest = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const { receiverId } = req.params;
  const friendRequest = new FriendRequest({
    sender: senderId,
    receiver: receiverId,
  });
  await friendRequest.save();
  res.json(resFormat("", "your friend request has been sent"));
});

export const cancelFriendRequest = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;

  const friendRequest = await FriendRequest.findByIdAndDelete(requestId);

  if (!friendRequest)
    return next(
      new ApiError(
        `there is no friend request with id ${requestId}` ,
        "fail",
        404
      )
    );

  res.json(resFormat("", "friend request cancelled successfully"));
});

export const acceptFriendRequest = async (req, res, next) => {
  const { requestId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  const errorMessage =
    "sorry we something went wrong while accepting the request";
  try {
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) return next(new ApiError(errorMessage, "fail", 404));

    const receiver = await User.findByIdAndUpdate(
      friendRequest.receiver,
      {
        $addToSet: { friends: friendRequest.sender },
      },
      { new: true, session }
    );

    if (!receiver) return next(new ApiError(errorMessage, "fail", 404));

    const sender = await User.findByIdAndUpdate(
      friendRequest.sender,
      {
        $addToSet: { friends: friendRequest.receiver },
      },
      { new: true, session }
    );

    if (!sender || !receiver) {
      await session.abortTransaction();
      session.endSession();
      return next(new ApiError(errorMessage, "fail", 404));
    }

    await FriendRequest.deleteOne({ _id: friendRequest._id });
    session.endSession();
    res.json(
      resFormat(
        "",
        `${sender.firstName} ${sender.lastName} and you are friends now`
      )
    );
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(err);
  } finally {
    session.endSession();
  }
};
