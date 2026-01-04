//health connection begins--------------------------------
import express from "express"; //import express
import healthRoutes from "./routes/health.routes.js";
import { ingestFakeStoreProducts } from "./workers/ingestor.js";
import { initScheduledJobs } from "./config/scheduler.js";

const app = express(); //initialize express application
const PORT = process.env.PORT || 3001;

// initialize scheduled jobs
initScheduledJobs();

//middleware
app.use(express.json());

//routes
app.use("/health", healthRoutes);

//log if server is running
app.listen(PORT, () => {
  console.log(`Server successfully running at http://localhost:${PORT}/health`);
});
//health connection ends----------------------------------------

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

//mount product routes------------------------------------------
import productRoutes from "./routes/product.routes.js";
app.use("/api/products", productRoutes);
//--------------------------------------------------------------

/*
01/04 - finished ingestion cron job

*/
