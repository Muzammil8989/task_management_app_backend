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

    res.cookie("access_token", accessToken, {
      httpOnly: true, // Secure cookie, cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === "production", // Ensure Secure cookies are only used in production (on HTTPS)
      sameSite: "None",
      maxAge: 30 * 60 * 1000,
      path: "/",
    });

    res.json({
      message: "Logged in successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
const logout = (req, res) => {
  // Ensure the cookie name and options match the one used when setting the cookie
  res.clearCookie("access_token", {
    httpOnly: true, // Cookie is accessible only by the web server
    secure: process.env.NODE_ENV === "production", // Set to true for https
    sameSite: "None", // Adjust based on your requirements
    path: "/", // Ensure the path matches the path where the cookie was set
  });
  res.json({ message: "Logged out successfully" });
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    console.log(userId);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, getProfile };
