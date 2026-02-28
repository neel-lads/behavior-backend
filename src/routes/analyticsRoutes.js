import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/analytics", authenticate, getAnalytics);

export default router;