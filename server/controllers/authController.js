import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register
export const registerUser = async (req, res) => {
  const { name, number, email, password, isAdmin = false } = req.body;

  const existingEmail = await User.findOne({ email });
  if (existingEmail)
    return res.status(400).json({ message: "Email already in use" });

  const existingNumber = await User.findOne({ number });
  if (existingNumber)
    return res.status(400).json({ message: "Phone number already in use" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    number,
    email,
    password: hashedPassword,
    isAdmin,
  });

  const token = generateToken(user._id, user.isAdmin);
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    number: user.number,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = generateToken(user._id, user.isAdmin);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    message: user.isAdmin ? "Redirect to admin dashboard" : "Redirect to user dashboard",
  });
};

// Logout
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.json({ message: "Logged out" });
};

export const getProfile = async (req, res) => {
  if (!req.user)
    return res.status(404).json({ message: "User not found" });

  res.json({
    name: req.user.name,
    number: req.user.number,
    email: req.user.email,
  });
};

export const updateProfile = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, number, email } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;
    user.number = number || user.number;

    await user.save();

    res.json({
      name: user.name,
      email: user.email,
      number: user.number,
    });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
};