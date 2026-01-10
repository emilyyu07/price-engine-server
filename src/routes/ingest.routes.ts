import { Router } from "express";
import { ingestFakeStoreProducts } from "../workers/ingestor.js";

const router = Router();

//manual ingestion trigger
router.get("/", async (_req, res, next) => {
  try {
    await ingestFakeStoreProducts();
    res.status(200).json({ message: "Ingestion completed successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
