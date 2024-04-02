import { check } from "express-validator";
import { validate } from "../../middlewares/validationResult.js";
import User from "../../models/user.model.js";
import FriendRequest from "../../models/friendRequest.model.js";

export const sendFriendRequestValidate = [
  check("receiverId", "invalid receiver id")
    .isMongoId()
    .custom(async (id, { req }) => {
      const receiver = await User.findById(id);
      if (!receiver) throw new Error("invalid receiver id");

      if (req.user.friends.includes(id))
        throw new Error("you are already friends");
    }),
  validate,
];

export const acceptFriendRequestValidate = [
  check("requestId", "invalid friend request id")
    .isMongoId()
    .custom(async (id, { req }) => {
      const friendRequest = await FriendRequest.findById(id);

      if (!friendRequest) throw new Error();
      if (
        friendRequest.receiver.toString() !== req.user._id.toString() 
      )
        throw new Error("sorry you can't accept this friend request");
    }),
    validate
];
export const cancelFriendRequestValidate = [
  check("requestId", "invalid friend request id")
    .isMongoId()
    .custom(async (id, { req }) => {
      const friendRequest = await FriendRequest.findById(id);

      if (!friendRequest) throw new Error();
      if (
        friendRequest.receiver.toString() !== req.user._id.toString() &&
        friendRequest.sender.toString() !== req.user._id.toString()
      )
        throw new Error("sorry you can't cancel this friend request");
    }),
    validate
];
