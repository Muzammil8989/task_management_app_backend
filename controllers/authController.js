const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email or username already exists.",
      });
    }

    // Create and save the new user
    const user = new User({ username, email, password });
    await user.save();

    // Respond with success message and user data
    res.status(201).json({
      message: "Registration successful. Please log in to continue.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("access_token", token, {
      httpOnly: true, // Secure cookie, cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === "production", // Ensure Secure cookies are only used in production (on HTTPS)
      sameSite: "None", // Allow cross-origin requests (necessary for SPAs with authentication)
      maxAge: 30 * 60 * 1000,
      path: "/",
      domain: ".netlify.app", // Wildcard domain for Netlify deployments
    });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie("access_token");
  res.json({ message: "Logged out successfully" });
};

module.exports = { register, login, logout };
