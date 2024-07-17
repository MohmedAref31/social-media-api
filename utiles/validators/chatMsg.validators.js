import { check } from "express-validator";
import { validate } from "../../middlewares/validationResult.js";

export const sendMsgValidate = [
  check("receiver").isMongoId().withMessage("invalid receiver ID"),
  check("message")
    .optional()
    .isString()
    .withMessage("message should be string"),
  validate,
];

export const updateMsgValidate = [
  check("msgId").isMongoId().withMessage("invalid message ID"),
  check("message")
    .notEmpty()
    .withMessage("message is required")
    .isString()
    .withMessage("message should be string"),
  validate,
];
export const getMsgsValidate = [
  check("otherUserId").isMongoId().withMessage("invalid message ID"),
  validate,
];
