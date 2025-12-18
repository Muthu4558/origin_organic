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
      .populate("items.product")
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
    const orders = await Order.find()
      .populate("user", "name email number")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// UPDATE ORDER STATUS (ADMIN)
router.put("/admin/update-status/:id", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin only" });
    }

    const { status, expectedDeliveryDate } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status === "DISPATCHED") {
      order.statusTimeline.dispatched = {
        status: true,
        date: new Date(),
      };

      if (expectedDeliveryDate) {
        order.expectedDeliveryDate = expectedDeliveryDate;
      }

      order.currentStatus = "DISPATCHED";
    }

    if (status === "DELIVERED") {
      order.statusTimeline.delivered = {
        status: true,
        date: new Date(),
      };
      order.currentStatus = "DELIVERED";
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
});

/* ✅ GET SINGLE ORDER (USER + ADMIN) — MUST BE LAST */
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "name email number");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Security: user can see own order, admin can see all
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

export default router;
