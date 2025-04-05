const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyJWT = require("../middlewares/verifyJWT");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", verifyJWT, authController.logout);

module.exports = router;
