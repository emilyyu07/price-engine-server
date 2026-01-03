//check health of server----------------------------------
import { Router } from "express";
import { getHealth } from "../controllers/health.controller.js";
const router = Router();

//point root of router to the controller function
router.get("/", getHealth);
export default router;

//----------------------------------------------------------
