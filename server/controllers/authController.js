  import jwt from "jsonwebtoken";
  import bcrypt from "bcryptjs";
  import User from "../models/User.js";
  import { OAuth2Client } from "google-auth-library";
  import crypto from "crypto";
import nodemailer from "nodemailer";


  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const generateToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  };

  // verification email setup
  const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const link = `${process.env.CLIENT_URL}/verify-email/${token}`;

  await transporter.sendMail({
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Please click the link below to verify your email:</p>
      <a href="${link}">${link}</a>
    `,
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

  const verificationToken = crypto.randomBytes(32).toString("hex");

  await User.create({
    name,
    number,
    email,
    password: hashedPassword,
    isAdmin,
    isVerified: false,
    verificationToken,
  });

  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({
    message: "Verification email sent. Please verify before login.",
  });
};

export const verifyEmail = async (req, res) => {
  const user = await User.findOne({
    verificationToken: req.params.token,
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({ message: "Email verified successfully" });
};



  // google login
  export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        number: Date.now(), // dummy unique number
        password: sub, // hashed later if needed
        isAdmin: false,
      });
    }

    // ✅ AUTO-VERIFY GOOGLE USERS
user.isVerified = true;
user.verificationToken = undefined;
await user.save();


    const jwtToken = generateToken(user._id, user.isAdmin);

    res.cookie("token", jwtToken, {
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
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

  // Login
  export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
  return res.status(403).json({
    message: "Please verify your email before logging in",
  });
}

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
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: req.user.name,
      number: req.user.number,
      email: req.user.email,
      addresses: req.user.addresses || [],
    });
  };

  export const updateProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { name, email, number } = req.body;

      user.name = name || user.name;
      user.email = email || user.email;
      user.number = number || user.number;

      await user.save();

      // ✅ RETURN FULL PROFILE (IMPORTANT)
      res.json({
        name: user.name,
        email: user.email,
        number: user.number,
        addresses: user.addresses || [],
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Profile update failed" });
    }
  };

  export const addAddress = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.addresses.push(req.body);
      await user.save();

      res.json(user.addresses);
    } catch (err) {
      res.status(500).json({ message: "Failed to add address" });
    }
  };

  export const updateAddress = async (req, res) => {
    try {
      const { addressId } = req.params;

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const address = user.addresses.id(addressId);
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }

      // ✅ UPDATE FIELDS SAFELY (NO REPLACEMENT)
      Object.keys(req.body).forEach((key) => {
        address[key] = req.body[key];
      });

      // ✅ SAVE WITHOUT FAILING REQUIRED FIELDS
      await user.save({ validateModifiedOnly: true });

      res.json(user.addresses);
    } catch (err) {
      console.error("UPDATE ADDRESS ERROR:", err);
      res.status(500).json({ message: "Failed to update address" });
    }
  };

  export const deleteAddress = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.addresses = user.addresses.filter(
        (addr) => addr._id.toString() !== req.params.addressId
      );

      await user.save();
      res.json(user.addresses);
    } catch (err) {
      res.status(500).json({ message: "Failed to delete address" });
    }
  };