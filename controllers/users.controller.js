import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { ApiError } from "../utiles/errorClass.js";
import { resFormat } from "../utiles/responseFormat.utiles.js";
import { objectSanitizer } from "../utiles/sanitization.js";

export const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user)
    return next(new ApiError(`there is no user with id ${id}`, "fail", 400));
  res.json(
    resFormat(
      "success",
      "",
      objectSanitizer(
        user,
        "_id",
        "firstName",
        "lastName",
        "email",
        "profileImage",
        "friends"
      )
    )
  );
});

export const getUserFriends = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("friends");

  if (!user)
    return next(new ApiError(`there is no user with id ${id}`, "fail", 400));
  let friends = user.friends.map((friend) =>
    objectSanitizer(friend, "_id", "firstName", "lastName", "profileImage")
  );
  res.json(resFormat("success", "", friends));
});
