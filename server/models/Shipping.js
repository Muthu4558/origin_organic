import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema(
  {
    state: { type: String, required: true },
    district: { type: String },

    shippingRates: {
      type: Map,
      of: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shipping", shippingSchema);
