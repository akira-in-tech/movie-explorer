const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  const { username, password, email, role } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ error: "Username taken" });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hash, email, role });
  res.json(user);
};

module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "User not found" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid password" });
  const token = jwt.sign({ userId: user._id, role: user.role }, "SECRET_KEY");
  res.json({ token, user });
};

module.exports.profile = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json(user);
};
