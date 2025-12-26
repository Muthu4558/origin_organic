import express from "express";
import {
  createCCAvenueOrder,
  ccavenueResponse,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/ccavenue-order", createCCAvenueOrder);
router.post("/ccavenue-response", ccavenueResponse);

export default router;
