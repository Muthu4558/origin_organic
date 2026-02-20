import Order from "../models/Order.js";
import mongoose from "mongoose";

export const getDashboardStats = async (req, res) => {
  try {
    const { from, to } = req.query;

    let matchStage = {};

    if (from && to) {
      matchStage.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to + "T23:59:59.999Z"),
      };
    }

    const stats = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          preparing: {
            $sum: {
              $cond: [{ $eq: ["$currentStatus", "PREPARING"] }, 1, 0],
            },
          },
          dispatched: {
            $sum: {
              $cond: [{ $eq: ["$currentStatus", "DISPATCHED"] }, 1, 0],
            },
          },
          delivered: {
            $sum: {
              $cond: [{ $eq: ["$currentStatus", "DELIVERED"] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json(stats[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};

export const getOrdersList = async (req, res) => {
  try {
    const { from, to } = req.query;

    let filter = {};

    if (from && to) {
      filter.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to + "T23:59:59.999Z"),
      };
    }

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("items.product", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Orders fetch failed" });
  }
};
