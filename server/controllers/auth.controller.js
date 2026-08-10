const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const { isValidEmail } = require("../utils/validation");

function getCookieOptions(env = process.env) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

module.exports.register = asyncHandler(async (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password;
  const email = req.body.email?.trim().toLowerCase();

  if (!username || !password || !email) {
    return res.status(400).json({ error: "Username, email and password are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) {
    return res.status(409).json({ error: "Username or email is already in use" });
  }

  const hash = await bcrypt.hash(password, 10);
  // role is intentionally never taken from the request body — it always
  // defaults to "USER" (see UserSchema) so a client can't self-promote to ADMIN.
  const user = await User.create({ username, password: hash, email });

  const safeUser = user.toObject();
  delete safeUser.password;
  res.status(201).json(safeUser);
});

module.exports.login = asyncHandler(async (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const safeUser = user.toObject();
  delete safeUser.password;

  res.cookie("token", token, getCookieOptions());
  res.json({ user: safeUser });
});

module.exports.logout = (req, res) => {
  res.clearCookie("token", getCookieOptions());
  res.json({ message: "Logged out" });
};

module.exports.profile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

module.exports.getCookieOptions = getCookieOptions;
