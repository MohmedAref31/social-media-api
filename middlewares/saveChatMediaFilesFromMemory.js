import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { fileURLToPath } from "url";
import { io } from "../server.js";
import { ApiError } from "../utiles/errorClass.js";
export const saveChatMediaFilesFromMemory = asyncHandler(async (req, res, next) => {
  if (!req.files?.media) return next();

  const media = req.files.media;
  const mediaLinks = [];
  const totalFilesSize = media.reduce((size, m) => size + m.buffer.length, 0);
  let uploadedSize = 0;

  // Helper function to save a single file
  const saveFile = (file) => {
    return new Promise((resolve, reject) => {
      const uniquePostfix = `${Date.now()}-${(Math.random() * 100).toString(32)}`;
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const filePath = `/assets/${uniquePostfix}-${file.originalname}`;
      const fileFullPath = path.join(__dirname, `../public${filePath}`);
      const writableStream = fs.createWriteStream(fileFullPath);
      const readableStream = Readable.from(file.buffer);

      readableStream.on("data", (chunk) => {
        uploadedSize += chunk.length;
        const progress = Math.round((uploadedSize / totalFilesSize) * 100);
        io.emit('upload-progress', { progress });
      });

      writableStream.on('finish', () => resolve(filePath));
      writableStream.on('error', (err) => reject(err));
      readableStream.on('error', (err) => reject(err));
      
      readableStream.pipe(writableStream);
    });
  };

  try {
    const fileSavePromises = media.map(saveFile);
    const savedFilesPaths = await Promise.all(fileSavePromises);
    req.mediaLinks = savedFilesPaths.map(filePath => `${filePath}`);
    next();
  } catch (error) {
    next(new ApiError("an error occurred while saving files", "error", 500));
  }
});
