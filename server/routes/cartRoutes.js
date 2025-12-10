import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  checkoutCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart); 
router.post("/add", addToCart);
router.post("/checkout", checkoutCart);
router.put("/update", updateCartItemQuantity);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

export default router;