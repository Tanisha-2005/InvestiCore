const express = require("express");
const router = express.Router();
const { register, login, me, getAllUsers, verifyOTP, resendOTP, googleAuth } = require("../controllers/authController");
const { protect, requireRole } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/google", googleAuth);
router.get("/me", protect, me);

// Admin-only route to inspect registered personnel & roles
router.get("/users", protect, requireRole("admin"), getAllUsers);

module.exports = router;
