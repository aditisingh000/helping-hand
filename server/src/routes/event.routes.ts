import { Router } from "express";
import rateLimit from "express-rate-limit";

import { createEvent, getEvents, getEventById, uploadEventBanner } from "../controllers/event.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { message: "Too many requests, please try again later." },
});

const router = Router();
router.use(limiter);

// Public route to get events
router.get("/", getEvents);
router.get("/:id", getEventById);

// Protected routes
router.post("/", authenticate, createEvent);
router.post("/:id/banner", authenticate, upload.single("banner"), uploadEventBanner);

export default router;
