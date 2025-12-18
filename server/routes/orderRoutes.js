import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import { placeOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/place", protect, placeOrder);

/* ✅ GET MY ORDERS */
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product") // 🔥 THIS IS CRITICAL
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// GET ALL ORDERS (ADMIN)
router.get("/admin/all", protect, async (req, res) => {
  try {
    // OPTIONAL: check admin role
    // if (!req.user.isAdmin) return res.status(403).json({ message: "Forbidden" });

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


export default router;
