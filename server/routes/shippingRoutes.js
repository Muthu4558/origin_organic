import express from "express";
import Shipping from "../models/Shipping.js";

const router = express.Router();

// GET
router.get("/", async (req, res) => {
    const data = await Shipping.find();
    res.json(data);
});

// ADD / UPDATE
router.post("/", async (req, res) => {
    const { state, district, halfKg, oneKg } = req.body;

    // if already exists -> update
    const existing = await Shipping.findOne({ state, district });

    if (existing) {
        existing.halfKg = halfKg;
        existing.oneKg = oneKg;
        await existing.save();
        return res.json(existing);
    }

    const newShipping = await Shipping.create({
        state,
        district,
        halfKg,
        oneKg,
    });

    res.json(newShipping);
});

// DELETE
router.delete("/:id", async (req, res) => {
    await Shipping.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

export default router;