//health connection begins--------------------------------
import express from "express"; //import express
import healthRoutes from "./routes/health.routes.js";

const app = express(); //initialize express application
const PORT = process.env.PORT || 3001;

//middleware
app.use(express.json());

//routes
app.use("/health", healthRoutes);

//log if server is running
app.listen(PORT, () => {
  console.log(`Server successfully running at http://localhost:${PORT}/health`);
});

//health connection ends----------------------------------------
