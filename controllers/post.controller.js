import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import { resFormat } from "../utiles/responseFormat.utiles.js";
import { ApiError } from "../utiles/errorClass.js";
import { objectSanitizer } from "../utiles/sanitization.js";
import Comment from "../models/comment.model.js";

export const createPost = asyncHandler(async (req, res, next) => {
  const { location, content } = req.body;
  const picture = req.file ? req.file.path.split("public")[1] : "";
  if (!content && !picture)
    return next(
      new ApiError("post picture or content is required", "fail", 400)
    );
  const post = await Post.create({
    user: req.user._id,
    location,
    content,
    picture,
  });

  res.json(
    resFormat(
      "",
      "post created successfully",
      objectSanitizer(
        post,
        "_id",
        "location",
        "content",
        "picture",
        "likesNumber",
        "commentsNumber"
      )
    )
  );
});

export const updatePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const newPic = req?.file?.path;
  if (newPic) req.body.picture = newPic.split("public")[1];
  const newPost = await Post.findByIdAndUpdate(postId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!newPost)
    return next(
      new ApiError("something went wrong while updating the post", "fail", 400)
    );

  res.json(
    resFormat(
      "",
      "post updated",
      objectSanitizer(
        newPost,
        "_id",
        "location",
        "content",
        "picture",
        "likesNumber",
        "commentsNumber"
      )
    )
  );
});

export const deletePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  await Post.findByIdAndDelete(postId);

  res.json(resFormat("", "post deleted successfully"));
});

export const getPostsFeed = asyncHandler(async (req, res, next) => {
  let { page, limit } = req.query;

  page = +page || 1;
  limit = +limit || 10;
  const skip = (page - 1) * limit;

  let posts = await Post.aggregate()
    .match({})
    .addFields({
      rank: { $cond: [{ $in: ["$user", req?.user?.friends || []] }, 1, 0] },
    })
    .sort({ createdAt: -1, rank: -1, likesNumber: -1, commentsNumber: -1 })
    .skip(skip)
    .limit(limit);

  posts = await Post.populate(posts, {
    path: "user",
    select: "firstName lastName profileImage",
  });

  console.log(posts);
  const sanitizedPosts = posts.map((post) =>
    objectSanitizer(
      post,
      "_id",
      "user",
      "content",
      "picture",
      "likesNumber",
      "commentsNumber",
      "createdAt",
      "updatedAt"
    )
  );
  res.json(
    resFormat("", "", {
      page,
      postsCount: sanitizedPosts.length,
      posts: sanitizedPosts,
    })
  );
});

export const toggleLike = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post)
    next(new ApiError("an error occured while toggle like", "fail", 404));

  if (post.likes.get(userId)) post.likes.delete(userId);
  else post.likes.set(userId, userId);

  await post.save();

  res.json(resFormat("", "like toggeled successfully"));
});

export const getlikedUsers = asyncHandler(async (req, res, next) => {
  let { page, limit } = req.query;

  page = +page || 1;
  limit = +limit || 10;
  const skip = (page - 1) * limit;

  const { postId } = req.params;

  console.log(postId);
  const post = await Post.findById(postId).populate("likes");

  if (!post)
    next(new ApiError("an error occured while get liked users", "fail", 404));

  console.log(skip, limit);
  const likes = Array.from(post.likes.values()).slice(skip, limit + skip);
  console.log(likes);
  const sanitizedLikes = likes.map((like) =>
    objectSanitizer(like, "_id", "firstName", "lastName", "profileImage")
  );

  res.json(resFormat("", "", sanitizedLikes));
});

// export const addComment = asyncHandler(async (req, res, next) => {
//   const { postId } = req.params;
//   const post = await Post.findById(postId);

//   if (!post)
//     return next(
//       new ApiError(`there is no such post with id ${postId}`, "fail", 404)
//     );

//   const comment = await Comment.create({
//     user: req.user._id,
//     content: req.body.content,
//   });

//   if (!comment)
//     return next(
//       new ApiError(`an error occurred while adding comment`, "error", 500)
//     );

//   post.comments.push(comment._id);

//   await post.save();

//   res.json(resFormat("success", "comment added successfully", post.comments));
// });



