import "reflect-metadata";
import "dotenv/config";

import { createApp } from "./app.js";
import { AppDataSource } from "./config/data-source.js";

const port = Number(process.env.PORT ?? 4000);
const app = createApp();

AppDataSource.initialize()
  .then(() => {
    console.log("Database initialized successfully!");
    app.listen(port, () => {
      console.log(`HelpingHand API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
