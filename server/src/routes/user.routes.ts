import { Router } from "express";

import { getUserProfile, updateProfile, uploadAvatar } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

// Get a user's remote profile by ID
router.get("/:id", getUserProfile);

// Update own profile
router.put("/:id", authenticate, updateProfile);

// Upload profile image
router.post("/:id/avatar", authenticate, upload.single("avatar"), uploadAvatar);

export default router;
