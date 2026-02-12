import Product from "../models/productModel.js";
import Order from "../models/Order.js";

/* ================= CREATE PRODUCT ================= */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      offerPrice,
      description,
      stock,
      brand,
      category,
      featured,
      unit,        // ✅ NEW
      packSize,    // ✅ NEW
    } = req.body;

    const image = req.file?.filename;

    const product = await Product.create({
      name,
      price,
      offerPrice,
      description,
      stock,
      brand,
      category,
      unit,
      packSize,
      image,
      featured: featured === "true",
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET BY CATEGORY ================= */
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= FEATURED ================= */
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ================= */
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      offerPrice,
      category,
      featured,
      stock,
      unit,        // ✅ NEW
      packSize,    // ✅ NEW
      description,
      brand,
    } = req.body;

    const updateData = {
      name,
      price,
      offerPrice,
      category,
      stock,
      unit,
      packSize,
      description,
      brand,
      featured: featured === "true",
    };

    if (req.file) updateData.image = req.file.filename;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET BY ID ================= */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADD REVIEW ================= */
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (!req.user)
      return res.status(401).json({ message: "User not authenticated" });

    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      "items.product": req.params.id,
      currentStatus: "DELIVERED",
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        message: "You can review this product only after delivery",
      });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      user: req.user._id,
      author: req.user.name || req.user.email || "User",
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    await product.save();

    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    console.error("REVIEW ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= CAN REVIEW ================= */
export const canReviewProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;

    const deliveredOrder = await Order.findOne({
      user: userId,
      "items.product": productId,
      currentStatus: "DELIVERED",
    });

    res.json({ canReview: !!deliveredOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
