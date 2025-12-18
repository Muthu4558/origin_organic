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
        quantity: Number,
        price: Number,
      },
    ],

    address: Object,

    totalAmount: Number,

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },
    paymentId: String,

    /* ✅ DELIVERY DATES */
    estimatedDeliveryDate: {
      type: Date,
      required: true,
    },
    expectedDeliveryDate: {
      type: Date, // admin entered
    },

    /* ✅ ORDER TRACKING */
    statusTimeline: {
      preparing: {
        status: { type: Boolean, default: true },
        date: { type: Date, default: Date.now },
      },
      dispatched: {
        status: { type: Boolean, default: false },
        date: Date,
      },
      delivered: {
        status: { type: Boolean, default: false },
        date: Date,
      },
    },

    currentStatus: {
      type: String,
      enum: ["PREPARING", "DISPATCHED", "DELIVERED"],
      default: "PREPARING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);