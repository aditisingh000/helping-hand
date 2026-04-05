import path from "path";

import cookieParser from "cookie-parser";
import csurf from "csurf";
import cors from "cors";
import express from "express";

import { AppDataSource } from "./config/data-source.js";
import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import userRoutes from "./routes/user.routes.js";

export function createApp() {
  const app = express();

  const allowedOrigins =
    process.env.CORS_ORIGIN?.split(",")
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0) ?? [];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no Origin (e.g., same-origin or non-browser clients)
        if (!origin) {
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Origin not allowed
        return callback(null, false);
      },
      credentials: true,
    }),
  );
  app.use(express.json());
  // lgtm [js/missing-csrf-middleware]
  // codeql[js/missing-csrf-middleware]
  app.use(cookieParser(process.env.COOKIE_SECRET || "fallback_secret_key_991283"));
  app.use(
    csurf({
      cookie: { signed: true },
      ignoreMethods: ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"],
    }),
  );

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/events", eventRoutes);

  // Serve static uploads
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.get("/health", async (_req, res) => {
    let dbStatus = "disconnected";
    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.query("SELECT 1");
        dbStatus = "connected";
      }
    } catch {
      dbStatus = "error";
    }

    res.status(200).json({ ok: true, db: dbStatus });
  });

  return app;
}
