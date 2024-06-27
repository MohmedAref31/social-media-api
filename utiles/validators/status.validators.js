import { check } from "express-validator";
import { validate } from "../../middlewares/validationResult.js";
import Status from "../../models/status.model.js";

export const createStatusValidate = [
  check("contentType")
    .notEmpty()
    .withMessage("content type is required")
    .isIn(["text", "image", "video"])
    .withMessage("allowed content types are text, image, video"),
  check("textContent")
    .if(check("contentType").equals("text"))
    .notEmpty()
    .withMessage("you must add content to status")
    .isLength({ max: 500 })
    .withMessage("max text content length is 500 characters"),

  validate,
];
