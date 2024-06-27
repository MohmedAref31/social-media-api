import { writeFile } from "fs";
import { ApiError } from "../utiles/errorClass.js";

const saveFileFromMemory = (req, res, next) => {
  try {
    if (req.file) {
      const type = req.file.mimetype.split("/")[0];
      if (type !== "video" && type !== "image") return next();
      const uniquePostfix = `${Date.now()}-${(Math.random() * 100).toString(
        32
      )} `;
      const filePath = `/assets/${uniquePostfix}-${req.file.originalname}`;
      req.body.mediaUrl = filePath;
      writeFile("public" + filePath, req.file.buffer, (err) => {
        if (err)
          return next(new ApiError("failed to save the media", "error", 500));
      });
    }
    next();
  } catch (err) {
    next(new ApiError("failed to save the media", "error", 500));
  }
};

export default saveFileFromMemory;
