import "reflect-metadata";
import "dotenv/config";

import { createApp } from "./app.js";
import { AppDataSource } from "./config/data-source.js";

const port = Number(process.env.PORT ?? 4000);
const app = createApp();

const connectWithRetry = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await AppDataSource.initialize();
      console.log("Database initialized successfully!");
      return true;
    } catch {
      console.error(
        `Database connection failed. Retrying in ${delay / 1000}s... (${i + 1}/${retries})`,
      );
      if (i === retries - 1) {
        console.error("Max retries reached. Exiting.");
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2; // Exponential backoff
    }
  }
};

connectWithRetry()
  .then(() => {
    app.listen(port, () => {
      console.log(`HelpingHand API listening on http://localhost:${port}`);
    });
  })
  .catch(console.error);
