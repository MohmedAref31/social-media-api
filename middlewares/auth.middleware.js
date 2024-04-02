import passport from "passport";
import {ApiError} from "../utiles/errorClass.js";


export const isLoggedIn = (req, res, next) => {
    if(!req.user)
      return next(new ApiError("please login ", "fail", 401));
    next()
}