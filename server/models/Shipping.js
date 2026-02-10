import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema(
    {
        state: String,
        district: String,
        halfKg: Number,
        oneKg: Number,
    },
    { timestamps: true }
);

export default mongoose.model("Shipping", shippingSchema);