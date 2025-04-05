const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const verifyJWT = (req, res, next) => {
  const token = req.cookies.access_token;

  console.log("👉 Incoming Request:");
  console.log("Cookies:", req.cookies);
  console.log("Access Token:", token);

  if (!token) {
    console.log("❌ No token found in cookies");
    return res.status(401).json({ message: "Unauthorized - No Token" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(403).json({ message: "Forbidden - Invalid Token" });
    }

    console.log("✅ Token verified successfully:", decoded);
    req.user = decoded;
    next();
  });
};

module.exports = verifyJWT;
