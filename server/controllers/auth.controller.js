const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports.register = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: "Username, email and password are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ error: "Username taken" });

  const hash = await bcrypt.hash(password, 10);
  // role is intentionally never taken from the request body — it always
  // defaults to "USER" (see UserSchema) so a client can't self-promote to ADMIN.
  const user = await User.create({ username, password: hash, email });

  const safeUser = user.toObject();
  delete safeUser.password;
  res.json(safeUser);
});

module.exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "User not found" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const safeUser = user.toObject();
  delete safeUser.password;

  res.cookie("token", token, COOKIE_OPTIONS);
  res.json({ user: safeUser });
});

module.exports.logout = (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "Logged out" });
};

module.exports.profile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json(user);
});
