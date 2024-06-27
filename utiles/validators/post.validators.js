import { check } from "express-validator";
import { validate } from "../../middlewares/validationResult.js";
import Post from "../../models/post.model.js";

export const createPostValidate = [
  check("location", "invalid location").optional().isString(),
  check("content")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("max length is 500 characters"),
  validate,
];
export const getPostsFeedValidate = [
  check("user", "invalid user id").optional().isMongoId(),
  check("page", "invalid page number").optional().isNumeric(),
  check("limit", "invalid limit count").optional().isNumeric(),
  validate,
];
export const updatePostValidate = [
  check("postId", "ivalid user id")
    .isMongoId()
    .custom(async (postId, { req }) => {
      const post = await Post.findById(postId);
      if (!post)
        throw new Error("something went wrong while updating the post");

      if (post.user.toString() !== req.user._id.toString())
        throw new Error("sorry you are not allowed to to update this post");
    }),
  check("location", "invalid location").optional().isString(),
  check("content")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("max length is 500 characters"),
  validate,
];

export const deletePostValidate = [
  check("id", "invalid document id")
    .isMongoId(),
  validate,
];

export const addCommentValidate = [
  check("id", "invalid document id").isMongoId(),
  check("content").notEmpty().withMessage("comment can't be empty").isString(),
  validate
];
export const updateCommentValidate = [
  check("commentId", "invalid comment id").isMongoId(),
  check("content")
    .optional()
    .isLength({ min: 1 })
    .withMessage("comment can't be empty")
    .isString(),
  validate
];
