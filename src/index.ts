import express from "express";
import cors from "cors";
import { initScheduledJobs } from "./config/scheduler.js";
import healthRoutes from "./routes/health.routes.js";
import productRoutes from "./routes/product.routes.js";
import alertRoutes from "./routes/alert.routes.js";
import ingestRoutes from "./routes/ingest.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express(); //initialize express application
const PORT = process.env.PORT || 3001;

// initialize scheduled jobs (start cron job when server starts)
initScheduledJobs();

//global middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/health", healthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/ingest", ingestRoutes);

//global error handling
app.use(errorHandler);

//log if server is running
app.listen(PORT, () => {
  console.log(`Server successfully running at http://localhost:${PORT}/health`);
});

/*
Mini update log
01/04 - finished ingestion cron job
01/07 - register alert routing and email notifications
        added a global error handler (ensures a clean JSON error will be 
        sent to frontend/React with upcoming integration)
01/09 - testing endpoints
      --> bug with alert endpoints (some error, might be with nodemailer? figure out tmr), other endpoints successful

01/10 - all endpoints working!, manually triggered ingestion and price drops


Next Steps:
- ensure app.use(cors()) is active for seamless integration with React


Optional Add-in (add in automated testing? with Jest?)
--> unit test for checkAlerts using Jest 

*/
