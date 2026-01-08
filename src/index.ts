import express from "express";
import cors from "cors";
import { ingestFakeStoreProducts } from "./workers/ingestor.js";
import { initScheduledJobs } from "./config/scheduler.js";
import healthRoutes from "./routes/health.routes.js";
import productRoutes from "./routes/product.routes.js";
import alertRoutes from "./routes/alert.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express(); //initialize express application
const PORT = process.env.PORT || 3001;

// initialize scheduled jobs
initScheduledJobs();

//global middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/health", healthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/alerts", alertRoutes);

//global error handling
app.use(errorHandler);

//log if server is running (health connection)
app.listen(PORT, () => {
  console.log(`Server successfully running at http://localhost:${PORT}/health`);
});

//database connection begins------------------------------------
app.post("/ingest", async (_req, res) => {
  try {
    await ingestFakeStoreProducts();
    res.status(200).json({ message: "Ingestion completed successfully" });
  } catch (error) {
    //error handling
    if (error instanceof Error) {
      console.error("Ingestion error:", error);
    } else {
      console.error("Unknown error");
    }
    res.status(500).json({ error: "Ingestion failed", details: error });
  }
});
//database connection ends--------------------------------------

/*
Mini update log
01/04 - finished ingestion cron job
01/07 - register alert routing and email notifications
        added a global error handler (ensures a clean JSON error will be 
        sent to frontend/React with upcoming integration)


Next Steps:
- manual API testing via Postman
- trigger nodecron and nodemailer (trigger a price drop manually, ingestor, etc.)
- ensure app.use(cors()) is active for seamless integration with React


Optional Add-in (add in automated testing? with Jest?)
--> unit test for checkAlerts using Jest 
*/
