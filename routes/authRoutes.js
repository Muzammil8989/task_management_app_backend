// In your authRoutes.js (or similar)
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/verifyJWT");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
