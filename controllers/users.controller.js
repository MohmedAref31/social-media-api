import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { ApiError } from "../utiles/errorClass.js";
import { resFormat } from "../utiles/responseFormat.utiles.js";
import { objectSanitizer } from "../utiles/sanitization.js";
import { comparePassword, hashPassword } from "../utiles/password.utiles.js";

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
        "profileImage"
      )
    )
  );
});

export const getUserFriends = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).populate(
    "friends",
    "firstName lastName profileImage"
  );

  if (!user)
    return next(new ApiError(`there is no user with id ${id}`, "fail", 400));

  res.json(resFormat("success", "", friends));
});

export const updateMe = asyncHandler(async (req, res, next) => {
  if (req.user.registerType !== "register") delete req.body?.email;

  const newUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!newUser)
    return next(
      new ApiError(`there is no user with such id ${req.user._id}`, "fail", 404)
    );
  res.json(
    resFormat(
      "success",
      "your account updated successfully",
      objectSanitizer(
        newUser,
        "_id",
        "firstName",
        "lastName",
        "email",
        "profileImage"
      )
    )
  );
});

export const updateMyPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (oldPassword === newPassword)
    return next(
      new ApiError("Old password and new password cannot be the same")
    );
  if (!comparePassword(oldPassword, req.user.password))
    return next(
      new ApiError(
        "it is seemed thad you do not remember your password",
        "fail",
        400
      )
    );

  let hashedPass = hashPassword(newPassword);
  const newUser = await User.findByIdAndUpdate(
    req.user._id,
    { password: hashedPass },
    { new: true, runValidators: true }
  );
  if (!newUser)
    return next(
      new ApiError(
        "something went wrong while updating your password",
        "fail",
        404
      )
    );
  res.json(
    resFormat("succcess", "your password has been updated successfully")
  );
});


export const updateMyImage = asyncHandler(async(req, res, next)=>{
  const user = await User.findById(req.user._id);
  let image = '';
  if(req.file) image = req.file.path.split('public')[1];
  user.profileImage = image;
  res.json(resFormat("","",objectSanitizer(user, "firstName", "lastName", "email", "profileImage")))
})