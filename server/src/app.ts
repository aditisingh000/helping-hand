import cors from "cors";
import express from "express";

import { AppDataSource } from "./config/data-source.js";

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
