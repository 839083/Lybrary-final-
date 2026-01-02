const express = require("express");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const router = express.Router();

/* ================= GOOGLE CLIENT ================= */
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  try {
    let { name, email, password, role, enrollment, adminCode } = req.body;

    // 🔐 Normalize email (CRITICAL)
    email = email.toLowerCase().trim();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role, // role decided ONLY here
      enrollment: role === "student" ? enrollment : "",
      adminCode: role === "admin" ? adminCode : "",
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
});

/* ================= LOGIN (RBAC CORRECT) ================= */
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    // 🔐 Normalize email
    email = email.toLowerCase().trim();

    // Find user ONLY by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Google user trying password login
    if (!user.password) {
      return res.status(400).json({
        message: "Please login using Google",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Role comes ONLY from DB
    res.status(200).json({
      message: "Login successful",
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

/* ================= GOOGLE LOGIN ================= */
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    let email = payload.email.toLowerCase().trim();
    const name = payload.name;

    let user = await User.findOne({ email });

    // New Google user → STUDENT by default
    if (!user) {
      user = new User({
        name,
        email,
        role: "student",
        password: "", // no password for Google users
      });
      await user.save();
    }

    res.status(200).json({
      message: "Google login successful",
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
});

/* ================= GET ALL STUDENTS ================= */
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name email");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students",
      error: error.message,
    });
  }
});

module.exports = router;
