import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  addPostComment,
  addStatusComment,
  deletePostComment,
  deleteReply,
  deleteStatusComment,
  getPostComments,
  getStatusComments,
  replyOnComment,
  toggleCommentLike,
  updateComment,
} from "../controllers/comment.controller.js";
import { addCommentValidate } from "../utiles/validators/post.validators.js";

const router = express.Router();
router.use(isLoggedIn);
router.get("/postComments/:id", getPostComments);
router.get("/statusComments/:id", getStatusComments);
router.post("/postComments/:id", addCommentValidate, addPostComment);
router.post("/statusComments/:id", addCommentValidate, addStatusComment);
router.patch("/:commentId", updateComment);
router.delete("/:modelId/statusComments/:commentId", deleteStatusComment);
router.delete("/:modelId/postComments/:commentId", deletePostComment);

router.post("/:commentId/likes", isLoggedIn, toggleCommentLike);
router.post("/reply/:commentId", isLoggedIn, replyOnComment)
router.delete('/reply/:replyId', isLoggedIn, deleteReply)

export default router;
