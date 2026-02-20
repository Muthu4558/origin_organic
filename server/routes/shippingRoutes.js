import express from "express";
import Shipping from "../models/Shipping.js";

const router = express.Router();

/* ================= GET ALL ================= */
router.get("/", async (req, res) => {
  try {
    const data = await Shipping.find().sort({ state: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= ADD OR UPDATE ================= */
router.post("/", async (req, res) => {
  try {
    const { id, state, district, shippingRates } = req.body;

    if (!state || !shippingRates) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (id) {
      const updated = await Shipping.findByIdAndUpdate(
        id,
        { state, district, shippingRates },
        { new: true }
      );
      return res.json(updated);
    }

    const existing = await Shipping.findOne({ state, district });

    if (existing) {
      existing.shippingRates = shippingRates;
      await existing.save();
      return res.json(existing);
    }

    const newShipping = await Shipping.create({
      state,
      district,
      shippingRates,
    });

    res.json(newShipping);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= DELETE ================= */
router.delete("/:id", async (req, res) => {
  try {
    await Shipping.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
