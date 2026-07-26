const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

exports.register = async (req, res) => {
  try {
    const { name, full_name, email, password, organization, role } = req.body;
    const userName = name || full_name;
    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
        detail: "Name, email, and password are required"
      });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: "An account with this email already exists",
        detail: "An account with this email already exists"
      });
    }

    const user = await User.create({
      name: userName,
      email,
      password,
      organization,
      role: role === "admin" ? "admin" : "investigator",
    });

    const token = signToken(user._id);
    res.status(201).json({
      token,
      access_token: token,
      refresh_token: token,
      user: user.toSafeObject(),
      message: "Account created successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", detail: err.message, error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        detail: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password",
        detail: "Invalid email or password"
      });
    }
    const token = signToken(user._id);
    res.json({
      token,
      access_token: token,
      refresh_token: token,
      user: user.toSafeObject()
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", detail: err.message, error: err.message });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
};
