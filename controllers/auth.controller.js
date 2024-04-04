import asyncHndler from "express-async-handler";
import User from "../models/user.model.js";
import { hashPassword } from "../utiles/password.utiles.js";
import { resFormat } from "../utiles/responseFormat.utiles.js";
import { objectSanitizer } from "../utiles/sanitization.js";

export const register = asyncHndler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const hashedPassword = hashPassword(password);

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if(req.file)
    user.profileImage = "/assets/"+req.file.filename

  await user.save();

  res.json(resFormat("", "register success", objectSanitizer(user,"_id", "firstName", "lastName", "email", "profileImage")));
});
export const loginSuccess = (req, res) => {
  res.json(resFormat("", "login success", { user: objectSanitizer(req.user,"_id", "firstName", "lastName", "email", "profileImage", "friends")}));
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
