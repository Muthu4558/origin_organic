import Cart from '../models/Cart.js';
import Product from '../models/productModel.js';

// GET cart
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate("items.product");
  res.json(cart || { items: [] });
};

// ADD to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  // Check if item exists
  const idx = cart.items.findIndex(item => item.product.toString() === productId);
  if (idx > -1) {
    cart.items[idx].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  res.json(cart);
};

// UPDATE quantity
export const updateCartItemQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  const idx = cart.items.findIndex(item => item.product.toString() === productId);
  if (idx > -1) {
    cart.items[idx].quantity = quantity;
    await cart.save();
    res.json(cart);
  } else {
    res.status(404).json({ message: "Item not found in cart" });
  }
};

// REMOVE item
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  await cart.save();
  res.json(cart);
};

// CLEAR cart
export const clearCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  cart.items = [];
  await cart.save();
  res.json(cart);
};

// CHECKOUT 
export const checkoutCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  cart.items = [];
  await cart.save();
  res.json({ message: "Checkout successful" });
};