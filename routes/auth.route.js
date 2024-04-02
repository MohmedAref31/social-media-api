import express from "express";
import passport from "passport";
import {
  register,
  logout,
  loginSuccess,
  loginFaild,
} from "../controllers/auth.controller.js";
import upload from "../middlewares/uploadFile.js";
import {
  loginValidator,
  registerValidator,
} from "../utiles/validators/auth.validators.js";
const router = express.Router();

router.post(
  "/register",
  upload.single("profileImage"),
  registerValidator,
  register
);
router.post(
  "/login",
  loginValidator,
  passport.authenticate("local", { failureRedirect: "/api/auth/loginFaild" }),
  loginSuccess
);

router.use("/loginFaild", loginFaild);
router.post("/logout", logout);

export default router;
