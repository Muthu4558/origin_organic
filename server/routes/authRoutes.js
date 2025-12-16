import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile ,
  updateProfile, 
  addAddress,
  deleteAddress,
  updateAddress
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Address routes
router.post("/address", protect, addAddress);
router.put("/address/:addressId", protect, updateAddress);
router.delete("/address/:addressId", protect, deleteAddress);

export default router;