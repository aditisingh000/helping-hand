import cors from "cors";
import express from "express";

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

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  return app;
}
