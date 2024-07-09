import asyncHandler from "express-async-handler";
import Comment from "../models/comment.model.js";
import { resFormat } from "../utiles/responseFormat.utiles.js";
import { ApiError } from "../utiles/errorClass.js";
import { objectSanitizer } from "../utiles/sanitization.js";

export const addComment = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const model = await Model.findById(id);

    if (!model)
      return next(
        new ApiError(`there is no such document with id ${id}`, "fail", 404)
      );

    const comment = await Comment.create({
      user: req.user._id,
      content: req.body.content,
      postId:id
    });

    if (!comment)
      return next(
        new ApiError(`an error occurred while adding comment`, "error", 500)
      );

    model.comments.push(comment._id);

    await model.save();

    res.json(
      resFormat("success", "comment added successfully")
    );
  });
export const deleteComment = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { modelId, commentId } = req.params;

    const model = await Model.findByIdAndUpdate(
      modelId,
      {
        $pull: { comments:  commentId  },
      },
      { new: true }
    );

    if (!model)
      return next(
        new ApiError(`there is no such document with this id ${modelId}`, "fail", 404)
      );

    await Comment.deleteOne({ _id: commentId });

    res.json(resFormat("", "comment deleted successfully"));
  });

export const getComments = (Model) =>
  asyncHandler(async (req, res, next) => {
    let { page, limit } = req.query;

    page = +page || 1;
    limit = +limit || 10;
    const skip = (page - 1) * limit;

    const { id } = req.params;

    const model = await Model.findById(id)
      .populate({
        path: "comments",
        select: "-__v",
        populate: {
          path: "user",
          model: "User",
          select: "firstName lastName profileImage",
        },
      })
      .populate("user");

    let comments = model.comments.slice(skip, limit);

    comments = comments.map((comment) =>
      objectSanitizer(
        comment,
        "_id",
        "content",
        "user",
        "likes",
        "createdAt",
        "updatedAt",
        "likesNumber",
        "repliesNumber"
      )
    );

    res.json(resFormat("", "", comments));
  });
