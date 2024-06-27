import asyncHandler from "express-async-handler";
import Comment from "../models/comment.model.js";
import { addComment, deleteComment, getComments } from "./comment.factory.js";
import Post from "../models/post.model.js";
import Status from "../models/status.model.js";
import { resFormat } from "../utiles/responseFormat.utiles.js";
import { ApiError } from "../utiles/errorClass.js";




export const addPostComment = addComment(Post)
export const addStatusComment = addComment(Status)

export const getPostComments = getComments(Post)
export const getStatusComments = getComments(Status)

export const deletePostComment = deleteComment(Post)
export const deleteStatusComment = deleteComment(Status)

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
      next(new ApiError(`there is no such a comment with id ${commentId}`, "fail", 404));
  
  
  
    if (comment.likes.get(userId)) comment.likes.delete(userId);
    else comment.likes.set(userId, userId);
  
    await comment.save();
  
    res.json(resFormat("", "like toggeled successfully"));
  });
