import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    category: {
      type: String,
      enum: ["Masala Items", "Milk Products", "Nuts", "Oils", "Diabetics Mix", "Apple Cider Vinegar", "Pickle", "Seeds"],
      required: true,
    },

    unit: {
      type: String,
      enum: ["g", "kg", "ml", "litre"],
      required: true,
    },

    packSize: {
      type: Number, // store actual number like 2, 100, 200, 500, 1
      required: true,
    },


    price: { type: Number, required: true },
    offerPrice: { type: Number },

    description: { type: String, required: true },

    stock: { type: Number, required: true, min: 0 },

    brand: { type: String, default: "N/A" },

    image: { type: String },

    featured: { type: Boolean, default: false },

    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        author: String,
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
