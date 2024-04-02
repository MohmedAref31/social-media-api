import { check } from "express-validator";
import User from "../../models/user.model.js";
import { validate } from "../../middlewares/validationResult.js";

export const registerValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .custom(async (email) => {
      console.log(email);
      const user = await User.findOne({ email: email });
      if (user) throw new Error("email is already in use");
    }),
  check("firstName")
    .isString()
    .notEmpty()
    .withMessage("first name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("first name must be between 2 and 5 characters"),
  check("lastName")
    .isString()
    .notEmpty()
    .withMessage("last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("last name must be between 2 and 5 characters"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    // .isStrongPassword({minLength:6})
    .withMessage("password length must be at least 6"),
  validate,
];
export const loginValidator = [
  check("email").isEmail().withMessage("invalid email"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    // .isStrongPassword({minLength:6})
    .withMessage("password length must be at least 6"),
  validate,
];
