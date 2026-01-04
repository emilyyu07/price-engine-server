import cron from "node-cron";
import { ingestFakeStoreProducts } from "../workers/ingestor.js";

export const initScheduledJobs = () => {
  // minute hour day month dayOfWeek
  // */x * * * * -> runs every x minutes

  cron.schedule("*/30 * * * *", async () => {
    const timestamp = new Date().toLocaleString();
    console.log(
      `Cron Job Started at ${timestamp}: Ingesting products from Fake Store API...`
    );
    try {
      await ingestFakeStoreProducts();
      console.log(`Cron Job Completed at ${timestamp}: Ingestion Successful`);
    } catch (error) {
      console.error(`Cron Job Failed at ${timestamp}: Ingestion Error`, error);
    }
  });

  console.log("Scheduled Jobs Initialized: set to run every 30 minutes.");
};
