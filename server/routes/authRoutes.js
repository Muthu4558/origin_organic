import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile ,
  updateProfile, 
  addAddress,
  deleteAddress,
  updateAddress,
  verifyEmail 
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { googleAuth } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/google", googleAuth);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.get("/verify", protect, (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
  });
});


// Address routes
router.post("/address", protect, addAddress);
router.put("/address/:addressId", protect, updateAddress);
router.delete("/address/:addressId", protect, deleteAddress);

export default router;