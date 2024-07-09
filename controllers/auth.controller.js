import asyncHndler from "express-async-handler";
import crypto from "node:crypto";
import User from "../models/user.model.js";
import { hashPassword } from "../utiles/password.utiles.js";
import { resFormat } from "../utiles/responseFormat.utiles.js";
import { objectSanitizer } from "../utiles/sanitization.js";
import { ApiError } from "../utiles/errorClass.js";
import { sendEmail } from "../utiles/sendEmail.utiles.js";

export const register = asyncHndler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const hashedPassword = hashPassword(password);

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if (req.file) user.profileImage = "/assets/" + req.file.filename;

  await user.save();

  res
    .status(201)
    .json(
      resFormat(
        "",
        "register success",
        objectSanitizer(
          user,
          "_id",
          "firstName",
          "lastName",
          "email",
          "profileImage"
        )
      )
    );
});
export const loginSuccess = (req, res) => {
  res.json(
    resFormat("", "login success", {
      user: objectSanitizer(
        req.user,
        "_id",
        "firstName",
        "lastName",
        "email",
        "profileImage",
        "friends"
      ),
    })
  );
};
export const loginFaild = (req, res) => {
  res.status(401).json(resFormat("fail", "email or password is wrong"));
};
export const googleSignInFaild = (req, res) => {
  res.status(401).json(resFormat("fail", "google sign in failed"));
};
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);

    return res.json(resFormat("success", "logout success"));
  });
};

export const forgotPassword = asyncHndler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new ApiError(
        `sorry we cannot find your account you can register new account`,
        "fail",
        404
      )
    );

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  user.passwordResetCodeExpiresAt = Date.now() + 5 * 60 * 1000;
  user.passwordResetCodeVerified = false;

  const emailContent = `
    <html>
  <body >
    <h1>Password reset code</h1>
    <p>hello here is you password reset code please follow the link to reset your password</p>
  <p><strong>${resetCode}</strong></p> 
 </body>
</html>
  `;
  try {
    await sendEmail(
      [{ email: user.email, name: `${user.firstName} ${user.lastName}` }],
      "Password Reset Code (valid for 5 minutes",
      emailContent
    );
  } catch (error) {
    console.log("error", error);
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpiresAt = undefined;
    user.passwordResetCodeVerified = undefined;
    return next(
      new ApiError(
        "sorry we cannot send you reset code at this moment! try again later !",
        "fail",
        404
      )
    );
  }
  await user.save();

  res.json(resFormat("sucess", "A reset code was send to your email"));
});

export const verifyResetCode = asyncHndler(async(req, res, next)=>{
  const {resetCode} = req.body;

  const hashedResetCode = crypto
  .createHash("sha256")
  .update(resetCode)
  .digest("hex");

  const user = await User.findOne({passwordResetCode:hashedResetCode, passwordResetCodeExpiresAt:{$gt:Date.now()}})

  if(!user) return next(new ApiError("your password reset code is invalid or expired", 'fail', 400));

  user.passwordResetCodeVerified = true;
  user.passwordResetCodeverifiedExpiresAt = Date.now() + 10 * 60 * 1000;
  await user.save();

  res.json(resFormat('success', 'reset code verified'));
})

export const resetPassword = asyncHndler(async(req, res, next) => {
  const {email, newPassword} = req.body;

  const user = await User.findOne({email, passwordResetCodeverifiedExpiresAt:{$gt:Date.now()}})
  
  if(!user) return next(new ApiError("invalid email or reset code verification"));

  const hashedPassword = hashPassword(newPassword);

  user.password = hashedPassword

  await user.save();
  
  res.json(resFormat("success", "password reset successfully"));
  
})