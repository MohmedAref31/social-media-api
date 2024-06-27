import asyncHandler from "express-async-handler";
import Status from "../models/status.model.js";
import { resFormat } from "../utiles/responseFormat.utiles.js";
import { ApiError } from "../utiles/errorClass.js";
import removeFile from "../utiles/removeFile.utiles.js";
import Comment from "../models/comment.model.js";

export const getFriendsStatus = asyncHandler(async (req, res, next) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;

  const user = req.user;

  const statuses = await Status.find(
    { user: { $in: user.friends } },
    "-likes -views -comments -__v -updatedAt"
  )
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: 1 });

  res.json(resFormat("success", "", statuses));
});

export const createStatus = asyncHandler(async (req, res, next) => {
  let { contentType, textContent, mediaUrl } = req.body;
  
  if (contentType !== "text") textContent = "";

  const newStatus = new Status({
    user: req.user._id,
    contentType,
    textContent,
    mediaUrl,
  });

  newStatus
    .save()
    .then(() =>
      res
        .status(201)
        .json(resFormat(201, "status created successfully", newStatus))
    )
    .catch((e) => {
      if (mediaUrl) removeFile(`public/${mediaUrl}`);
      next(
        new ApiError(
          e.message || "something went wrong while creating status",
          "error",
          500
        )
      );
    });
});

export const deleteStatus = asyncHandler(async (req, res, next) => {
  const { statusId } = req.params;
  const userId = req.user._id;

  const status = await Status.findById(statusId);
  if (!status)
    return next(
      new ApiError(`there is no such status with id ${statusId}`, "fail", 404)
    );
  if (status.user.toString() !== userId.toString())
    return next(
      new ApiError("you are not allowed to delete this status", "fail", 403)
    );

  Status.deleteOne({ _id: statusId })
    .then(() => {
      if (status.mediaUrl) removeFile("public" + status.mediaUrl);
      res.json(resFormat(200, "status deleted successfully"));
    })
    .catch((err) =>
      next(
        new ApiError(
          err.message || "something went wrong while deleting status",
          "error",
          500
        )
      )
    );
});

export const getStatusById = asyncHandler(async (req, res, next) => {
  const { statusId } = req.params;

  const status = await Status.findById(statusId, "-__v -updatedAt").populate(
    "likes views",
    "firstName lastName profileImage"
  );

  if (!status)
    return next(
      new ApiError(`there is no status with such id ${statusId}`, "fail", 404)
    );

  if (status.user.toString() !== req.user._id.toString())
    return next(
      new ApiError(`you arr not allowed to get this status`, "fail", 403)
    );

  res.json(resFormat("success", "", status));
});

export const addViewToStatus = asyncHandler(async (req, res, next) => {
  const { statusId } = req.params;
  const userId = req.user._id;

  const status = await Status.findById(statusId);

  if (!status)
    next(new ApiError("this status is no longer exist", "fail", 404));

  if (!status.views.includes(userId)) status.views.push(userId);

  await status.save();

  res.json(resFormat("", "status viewed successfully"));
});

export const addLikeToStatus = asyncHandler(async (req, res, next) => {
  const { statusId } = req.params;
  const userId = req.user._id;

  const status = await Status.findById(statusId);

  if (!status)
    next(new ApiError("this status is no longer exist", "fail", 404));

  if (!status.likes.includes(userId)) status.likes.push(userId);

  await status.save();

  res.json(resFormat("", "status liked successfully"));
});

export const addCommentToStatus = asyncHandler(async (req, res, next) => {
    const {statusId} = req.params;
    const status = await Status.findById(statusId);

    if(!status) return next(new ApiError(`there is no such status with id ${statusId}`, 'fail', 404))

    const comment = await Comment.create({user:req.user._id, content:req.body.content})

    if(!comment) return next(new ApiError(`an error occurred while adding comment`, 'error', 500))

    status.comments.push(comment._id);

   await status.save();

   res.json(resFormat("success", "comment added successfully", status.comments))

});
