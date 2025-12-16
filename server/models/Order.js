import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    address: {
      street: String,
      landmark: String,
      area: String,
      city: String,
      district: String,
      state: String,
      pincode: String,
    },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Placed" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);