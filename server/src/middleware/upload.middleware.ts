import multer from "multer";
import { Request } from "express";

// Use memory storage so we can process with sharp before saving
const storage = multer.memoryStorage();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fileFilter = (req: Request, file: any, cb: multer.FileFilterCallback) => {
  // Accept only images
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
