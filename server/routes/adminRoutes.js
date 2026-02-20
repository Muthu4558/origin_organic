import express from "express";
import {
  getDashboardStats,
  getOrdersList,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard-stats", getDashboardStats);
router.get("/orders-list", getOrdersList);

export default router;
