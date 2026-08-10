const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../config/auth.middleware");
const rateLimiter = require("../utils/rateLimiter");

const authLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 20 });

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/logout", authController.logout);
router.get("/profile", authMiddleware, authController.profile);

module.exports = router;
