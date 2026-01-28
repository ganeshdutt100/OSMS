// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Register new user
exports.register = async (req, res) => {
  try {
    const { user_id, name, email, password, role, dept_id } = req.body;

    // Validate required fields
    if (!user_id || !name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      user_id,
      name,
      email,
      password: hashed,
      role,
      dept_id,
      status: "ACTIVE",
    });

    await user.save();

    // Save session
    req.session.user = {
      id: user._id,
      user_id: user.user_id,
      name: user.name,
      dept_id: user.dept_id,
      role: user.role,
      status: user.status,
    };

    // Respond with success
    return res.json({
      success: true,
      message: "Registered successfully",
      user: req.session.user,
    });
  } catch (err) {
    console.error("Register error:", err);

    // Handle duplicate key error (MongoDB E11000)
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Duplicate field value", details: err.keyValue });
    }

    return res.status(500).json({ error: "Server error" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    req.session.user = {
      id: user._id,
      user_id: user.user_id,
      name: user.name,
      dept_id: user.dept_id,
      role: user.role,
      status: user.status,
    };

    return res.json({
      success: true,
      message: "Logged in successfully",
      user: req.session.user,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Logged out" });
  });
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Missing password fields" });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ error: "Current password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const deleted = await User.findOneAndDelete({ email });
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      success: true,
      message: `User with email ${email} deleted successfully`,
    });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
