import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: {type: Number, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    isAdmin: { type: Boolean, default: false },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);