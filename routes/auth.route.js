import express from "express";
import passport from "passport";
import {
  register,
  logout,
  loginSuccess,
  loginFaild,
  googleSignInFaild,
  forgotPassword,
  verifyResetCode,
  resetPassword,
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
  passport.authenticate("local", {
    failureRedirect: "/api/v1/auth/loginFaild",
  }),
  loginSuccess
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/googleFaild",
  }),
  loginSuccess
);

router.post("/logout", logout);

router.use("/loginFaild", loginFaild);
router.use("/googleFaild", googleSignInFaild);

router.post('/forgot-password', forgotPassword)
router.post('/verify-reset-code', verifyResetCode)
router.post('/reset-password', resetPassword)
export default router;
