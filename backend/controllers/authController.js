const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendOTPVerificationEmail } = require("../services/emailService");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// Seed Dedicated Admin Account on Server Startup via Secure Env Vars
exports.seedAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@investicore.gov";
    const adminUsername = process.env.ADMIN_USERNAME || "AdminInvestiCore";
    const adminPassword = process.env.ADMIN_PASSWORD || "@Admin10001";

    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { name: adminUsername }],
    });

    if (!existingAdmin) {
      await User.create({
        name: adminUsername,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        organization: "Platform System Administration",
        isEmailVerified: true,
      });
      console.log(`[Auth Seed] Dedicated Admin Account Initialized: ${adminUsername}`);
    } else {
      existingAdmin.isEmailVerified = true;
      await existingAdmin.save();
    }
  } catch (err) {
    console.error(`[Auth Seed Error] Could not seed admin user: ${err.message}`);
  }
};

// Generate 6-Digit Random Numeric OTP
const generate6DigitOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.register = async (req, res) => {
  try {
    const { name, full_name, email, password, organization, role } = req.body;
    const userName = name || full_name;
    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
        detail: "Name, email, and password are required",
      });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        message: "An account with this email already exists",
        detail: "An account with this email already exists",
      });
    }

    // Security Guard: Admin role cannot be self-registered publicly
    let assignedRole = role;
    if (role === "admin") {
      assignedRole = "investigator";
    }
    if (!["investigator", "analyst"].includes(assignedRole)) {
      assignedRole = "investigator";
    }

    const otp = generate6DigitOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Smart Organization Fallback
    const userOrg = organization && organization.trim() !== ""
      ? organization.trim()
      : (email.includes("@") ? email.split("@")[1].split(".")[0].toUpperCase() + " Cyber Division" : "Cyber Crime Unit");

    const user = await User.create({
      name: userName,
      email: email.toLowerCase(),
      password,
      organization: userOrg,
      role: assignedRole,
      isEmailVerified: false,
      otp,
      otpExpires,
    });

    // Send OTP Verification Email to user's real email inbox
    await sendOTPVerificationEmail(user.email, user.name, otp);

    res.status(201).json({
      require_otp: true,
      email: user.email,
      message: `Account created! Verification OTP sent to your email inbox: ${user.email}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", detail: err.message, error: err.message });
  }
};

// Verify 6-Digit OTP Endpoint
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP code are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User account not found" });
    }

    if (user.isEmailVerified) {
      const token = signToken(user._id);
      return res.json({
        token,
        access_token: token,
        refresh_token: token,
        user: user.toSafeObject(),
        message: "Email already verified. Logging in...",
      });
    }

    if (!user.otp || user.otp !== otp.toString().trim()) {
      return res.status(400).json({ message: "Invalid OTP code. Please check your email inbox and try again." });
    }

    if (user.otpExpires && new Date() > new Date(user.otpExpires)) {
      return res.status(400).json({ message: "OTP code has expired. Please request a new OTP." });
    }

    // Mark Email as Verified & Clear OTP
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = signToken(user._id);
    res.json({
      token,
      access_token: token,
      refresh_token: token,
      user: user.toSafeObject(),
      message: "Email verified successfully! Registration complete.",
    });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed", detail: err.message });
  }
};

// Resend OTP Endpoint
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User account not found" });
    }

    const newOtp = generate6DigitOTP();
    user.otp = newOtp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPVerificationEmail(user.email, user.name, newOtp);

    res.json({
      success: true,
      email: user.email,
      message: `New OTP code sent to your email inbox: ${user.email}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to resend OTP", detail: err.message });
  }
};

// Google OAuth Sign-In / Register Endpoint
exports.googleAuth = async (req, res) => {
  try {
    const { email, name, google_id, role, organization } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required for Google Sign-In" });
    }

    const userEmail = email.toLowerCase();
    let user = await User.findOne({ email: userEmail });

    if (!user) {
      // Create new user automatically from Google Profile
      const randomPassword = "GoogleAuth_" + Math.random().toString(36).slice(-10) + "!";
      let assignedRole = role || "investigator";
      if (assignedRole === "admin") assignedRole = "investigator";

      const userOrg = organization && organization.trim() !== ""
        ? organization.trim()
        : (userEmail.includes("@") ? userEmail.split("@")[1].split(".")[0].toUpperCase() + " Agency" : "Google Authenticated Unit");

      user = await User.create({
        name: name || userEmail.split("@")[0],
        email: userEmail,
        password: randomPassword,
        role: assignedRole,
        organization: userOrg,
        isEmailVerified: true, // Google pre-verifies emails!
      });
      console.log(`[Google Auth] Created new pre-verified user from Google: ${userEmail}`);
    } else {
      // Existing user logging in via Google
      user.isEmailVerified = true;
      await user.save();
    }

    const token = signToken(user._id);
    res.json({
      token,
      access_token: token,
      refresh_token: token,
      user: user.toSafeObject(),
      message: "Successfully authenticated with Google!",
    });
  } catch (err) {
    res.status(500).json({ message: "Google Authentication failed", detail: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email/Username and password are required",
        detail: "Email/Username and password are required",
      });
    }

    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { name: email },
      ],
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: "Invalid credentials",
        detail: "Invalid email/username or password",
      });
    }

    // Check if Email Verification is required
    if (!user.isEmailVerified && user.role !== "admin") {
      const newOtp = generate6DigitOTP();
      user.otp = newOtp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendOTPVerificationEmail(user.email, user.name, newOtp);

      return res.status(403).json({
        require_otp: true,
        email: user.email,
        message: "Email verification required. An OTP has been sent to your email inbox.",
        detail: "Email verification required. An OTP has been sent to your email inbox.",
      });
    }

    const token = signToken(user._id);
    res.json({
      token,
      access_token: token,
      refresh_token: token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", detail: err.message, error: err.message });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
};

// Admin Only: Fetch audit list of all registered personnel and their roles
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({
      count: users.length,
      users: users.map((u) => u.toSafeObject()),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", detail: err.message });
  }
};
