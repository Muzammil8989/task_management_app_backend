const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const verifyJWT = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No Token" });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden - Invalid Token" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyJWT;
