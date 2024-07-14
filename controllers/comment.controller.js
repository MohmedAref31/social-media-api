import asyncHandler from "express-async-handler";
import Comment from "../models/comment.model.js";
import { addComment, deleteComment, getComments } from "./comment.factory.js";
import Post from "../models/post.model.js";
import Status from "../models/status.model.js";
import { resFormat } from "../utiles/responseFormat.utiles.js";
import { ApiError } from "../utiles/errorClass.js";
import { createNotification } from "../utiles/createNotification.utiles.js";

export const addPostComment = addComment(Post);
export const addStatusComment = addComment(Status);

export const getPostComments = getComments(Post);
export const getStatusComments = getComments(Status);

export const deletePostComment = deleteComment(Post);
export const deleteStatusComment = deleteComment(Status);

export const updateComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;

  const { content } = req.body;
  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  );

  if (!comment)
    return next(
      new ApiError(`there is no comment with such id ${commentId}`, "fail", 404)
    );
  res.json(resFormat("", "comment updated successfully", { comment }));
});

export const toggleCommentLike = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);

  if (!comment)
    next(
      new ApiError(
        `there is no such a comment with id ${commentId}`,
        "fail",
        404
      )
    );

  if (comment.likes.get(userId)) comment.likes.delete(userId);
  else {
    comment.likes.set(userId, userId);
    const notificationMsg = `${req.user.firstName} ${req.user.lastName} liked your comment`;
    createNotification(notificationMsg, comment.user);
  }
  await comment.save();

 

  res.json(resFormat("", "like toggeled successfully"));
});

export const replyOnComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment)
    return next(
      new ApiError(
        `there is no such a comment with this id ${commentId}`,
        "fail",
        404
      )
    );

  const reply = await Comment.create({
    user: req.user._id,
    content: req.body.content,
    postId: comment.postId,
    parentComment: comment._id,
    type: "reply",
  });

  if (!comment)
    return next(
      new ApiError(`an error occurred while adding a reply`, "error", 500)
    );

  comment.replies.push(reply._id);

  await comment.save();

  const notificationMsg = `${req.user.firstName} ${req.user.lastName} replied on your comment`;
  createNotification(notificationMsg, comment.user);

  res.json(resFormat("success", "replay added successfully"));
});

export const deleteReply = asyncHandler(async (req, res, next) => {
  const { replyId } = req.params;
  const reply = await Comment.findById(replyId);

  if (reply.user !== req.user._id)
    return next(
      new ApiError(`you are not allowed to delete this reply`, "fail", 403)
    );

  if (!reply)
    return next(
      new ApiError(`there is no reply with id ${replyId}`),
      "fail",
      404
    );

  const parentComment = await Comment.findById(reply.parentComment);

  await Comment.deleteOne({ _id: replyId });

  if (parentComment.replies)
    parentComment.replies = parentComment.replies.filter(
      (r) => r.toString() !== replyId
    );

  await parentComment.save();

  res.json(resFormat("success", "reply deleted successfully"));
});
