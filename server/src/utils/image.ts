import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

import sharp from "sharp";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

/**
 * Validates, resizes, and saves a profile image (avatar).
 * Enforces a square aspect ratio.
 */
export const processProfileImage = async (buffer: Buffer): Promise<string> => {
  const filename = `${crypto.randomUUID()}-${Date.now()}.webp`;
  const filepath = path.join(uploadDir, filename);

  await sharp(buffer)
    .resize(400, 400, { fit: "cover" }) // 400x400 for profile pictures
    .webp({ quality: 80 }) // Convert perfectly to modern webp
    .toFile(filepath);

  // Return the public URL path
  return `/uploads/${filename}`;
};

/**
 * Validates, resizes, and saves an event banner image.
 * Maintains a 16:9 aspect ratio standard.
 */
export const processBannerImage = async (buffer: Buffer): Promise<string> => {
  const filename = `${crypto.randomUUID()}-${Date.now()}.webp`;
  const filepath = path.join(uploadDir, filename);

  await sharp(buffer)
    .resize(1200, 675, { fit: "cover" }) // Standardized 16:9 ratio suitable for banners
    .webp({ quality: 85 })
    .toFile(filepath);

  return `/uploads/${filename}`;
};
