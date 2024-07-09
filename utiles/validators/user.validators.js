import { check } from "express-validator";
import { validate } from "../../middlewares/validationResult.js";

export const updateMeValidate = [
  check("firstName").optional().isString(),
  check("lastName").optional().isString(),
  check("email").optional().isEmail(),
  validate,
];

export const updateMyPassowrd = [
  check("oldPassword")
    .notEmpty()
    .withMessage("old password is required")
    .isString(),
  check("newPassword")
    .notEmpty()
    .withMessage("new password is required")
    .isString()
    .isLength({ min: 6, max: 18 })
    .withMessage("password must be between 6 and 18 characters"),
    validate
];
