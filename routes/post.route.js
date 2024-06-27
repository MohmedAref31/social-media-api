import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/uploadFile.js";
import {  createPostValidate, deletePostValidate, getPostsFeedValidate,updatePostValidate } from "../utiles/validators/post.validators.js";
import { createPost, deletePost, getPostsFeed, getlikedUsers, toggleLike, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/",getPostsFeedValidate,getPostsFeed)
router.get('/:postId/likes', getlikedUsers)
// router.get("/:postId/comments", getComments)
router.use(isLoggedIn)
router.post("/", upload.single("picture"), createPostValidate,createPost );
router.patch("/:postId", upload.single("picture"), updatePostValidate, updatePost );
router.delete("/:postId",deletePostValidate, deletePost)

router.post('/:postId/likes', toggleLike)

// router.post("/:postId/comments",addCommentValidate,addComment);
// router.post("/:postId/comments/:commentId/likes",toggleCommentLike)
// router.delete("/:postId/comments/:commentId", deletePostComment)

export default router;
